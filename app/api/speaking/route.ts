// app/api/speaking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { protos } = require('@google-cloud/speech') as typeof import('@google-cloud/speech');

// 懒加载客户端
let speechClient: SpeechClient | null = null;
let geminiModel: any = null;

function getSpeechClient() {
  if (!speechClient) speechClient = new SpeechClient();
  return speechClient;
}

function getGeminiModel() {
  if (geminiModel) return geminiModel;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 未配置！请在 .env.local 或 Vercel 中设置');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // 关键修复：responseMimeType 在顶级，generationConfig 只放生成参数
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json', // 正确的位置
      temperature: 0.7,
    }
  });
  console.log('Gemini initialized with v1 API and responseMimeType');
  return geminiModel; // 必须 return！
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const refText = formData.get('text') as string | null;

    if (!audioFile || !refText) {
      return NextResponse.json({ error: 'Missing audio or text' }, { status: 400 });
    }

    // === 动态识别文件类型 ===
    const fileName = audioFile.name.toLowerCase();
    let encoding: any;

    if (fileName.endsWith('.mp3')) {
      encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3;
    } else if (fileName.endsWith('.webm') || fileName.endsWith('.ogg')) {
      encoding = protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.WEBM_OPUS;
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Use .mp3 or .webm' },
        { status: 400 }
      );
    }

    // === Speech-to-Text ===
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const [resp] = await getSpeechClient().recognize({
      audio: { content: buffer },
      config: {
        encoding,
        // 移除硬编码的采样率，让 Google API 自动处理
        // sampleRateHertz: 48000, 
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        // 使用模型可以提高识别准确率，并能更好地处理不同采样率的音频
        // 'telephony' 适用于电话录音，'latest_long' 适用于任意长音频
        model: 'latest_long',
      },
    });

    const transcript =
      resp.results
        ?.map((r) => r.alternatives?.[0]?.transcript)
        .join(' ') ?? '';

    if (!transcript.trim()) {
      return NextResponse.json({ error: 'No speech detected' }, { status: 400 });
    }

    // === Gemini 发音分析 ===
    const model = getGeminiModel();
    const prompt = `
You are an English pronunciation coach.
Reference: "${refText}"
Transcribed: "${transcript}"

Return ONLY valid JSON:
{
  "accuracyScore": 0-100,
  "fluencyScore": 0-100,
  "wordDetails": [{ "word": string, "accuracy": 0-100, "feedback": string }]
}
`;

    const result = await model.generateContent(prompt);
    const rawText = await result.response.text();
    const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return NextResponse.json(JSON.parse(jsonText));
    } catch {
      return NextResponse.json({ error: 'Invalid AI JSON', raw: jsonText }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}