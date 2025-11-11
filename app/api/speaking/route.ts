import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AudioEncoding } from '@google-cloud/speech/build/src/v1/speech_client';

// 在模块顶层初始化客户端，以在多个请求之间复用
const speechClient = new SpeechClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;
    const text = formData.get('text') as string | null;

    if (!audioFile || !text) {
      return NextResponse.json({ error: 'Missing audio file or text data' }, { status: 400 });
    }

    // --- 1. 语音转文字 (Speech-to-Text) ---
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const audio = { content: audioBuffer };
    const config = {
      encoding: 'WEBM_OPUS' as AudioEncoding, // 确保这个编码与前端录制格式一致
      sampleRateHertz: 48000, // 确保这个采样率与前端录制格式一致
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
    };
    const sttRequest = { audio, config };

    const sttResponseArray = await speechClient.recognize(sttRequest);
    const sttResponse = sttResponseArray[0];
    const transcribedText = sttResponse.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .join('\n') || '';

    if (!transcribedText) {
      return NextResponse.json({ error: 'Could not transcribe audio.' }, { status: 500 });
    }

    // --- 2. 使用 Gemini 进行发音评估 ---
    const prompt = `
      Analyze the pronunciation of the following speech.
      Reference Text: "${text}"
      Transcribed Text: "${transcribedText}"
      
      Provide a detailed pronunciation analysis in JSON format. The JSON object must contain:
      1.  An overall "accuracyScore" (0-100).
      2.  A "fluencyScore" (0-100).
      3.  An array named "wordDetails" where each object has "word", "accuracy" (0-100), and a "feedback" message for mispronounced words.
      
      Your response MUST be only the valid JSON object, with no other text or explanations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    const pronunciationResult = JSON.parse(aiText);

    return NextResponse.json(pronunciationResult);

  } catch (error) {
    console.error("Error in speaking API:", error);
    if (error instanceof Error && error.message.includes('429')) {
        return NextResponse.json({ error: 'AI API rate limit exceeded. Please try again later.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}