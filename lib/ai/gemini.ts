import { GoogleGenerativeAI } from '@google/generative-ai';
import { SpeechClient } from '@google-cloud/speech';
import { ApiError } from './errors';

// --- 初始化客户端 ---

// 初始化 Gemini API 客户端
// 确保您已在 .env.local 文件中设置了 GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// 初始化 Google Cloud Speech-to-Text 客户端
// 这需要您设置 Google Cloud 认证。
// 请参考文档：https://cloud.google.com/docs/authentication/provide-credentials-adc
const speechClient = new SpeechClient();


// --- 对话生成 ---

export async function generateGeminiConversation(
  scenario: string,
  userMessage: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // 转换历史记录格式以适应 Gemini
    const geminiHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const systemInstruction = `You are a helpful English conversation partner in a ${scenario} scenario. Respond naturally and helpfully in English.`;
    const fullPrompt = `${systemInstruction}\n\nUser: ${userMessage}`;

    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('AI 응답이 비어있습니다.');
    }
    return text;

  } catch (error: any) {
    console.error('Gemini conversation generation error:', error);
    throw new ApiError(error.message || 'Gemini 대화 생성 중 오류가 발생했습니다.', 500);
  }
}


// --- 发音分析 ---

export async function analyzePronunciationWithGoogle(
  audioBlob: Blob,
  expectedText: string
): Promise<{
  score: number;
  feedback: string;
  transcription: string;
}> {
  try {
    // 1. 使用 Google Cloud Speech-to-Text 进行语音转写
    const audioBytes = Buffer.from(await audioBlob.arrayBuffer()).toString('base64');
    const audio = { content: audioBytes };
    const config = {
      encoding: 'WEBM_OPUS', // 假设从浏览器录制的是 webm 格式
      sampleRateHertz: 48000, // MediaRecorder 默认采样率通常是 48000
      languageCode: 'en-US',
    };
    const request = { audio, config };

    // 修复：避免直接解构，以解决 TypeScript 类型推断问题
    const recognizeResult = await speechClient.recognize(request);
    const speechResponse = recognizeResult[0];
    console.log('Google Speech-to-Text raw response:', JSON.stringify(speechResponse, null, 2)); // 添加此行
    const transcription = speechResponse.results
      ?.map(result => result.alternatives?.[0].transcript)
      .join('\n') || '';

    if (!transcription) {
      console.error('Transcription was empty. Speech-to-Text might have failed to recognize speech or returned no results.'); // 添加此行
      throw new Error('음성을 텍스트로 변환하지 못했습니다.');
    }

    // 2. 使用 Gemini-Pro 评估发音
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an expert English pronunciation evaluator. Compare the transcribed text with the expected text and provide detailed feedback in Korean. Focus on pronunciation accuracy, clarity, and naturalness.

Expected text: "${expectedText}"
Transcribed text: "${transcription}"

Please evaluate the pronunciation and provide a score (0-100) and detailed feedback in Korean. The score should be clearly marked like this: "Score: 85/100".`;

    const result = await model.generateContent(prompt);
    const evaluation = result.response.text();

    const scoreMatch = evaluation.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 75; // 如果找不到分数，默认为 75

    return {
      score,
      feedback: evaluation.replace(/Score:\s*\d+\/100[:\s]*/i, '').trim(),
      transcription: transcription,
    };
  } catch (error: any) {
    console.error('Google pronunciation analysis error:', error);
    throw new ApiError(error.message || 'Google 음성 분석 중 오류가 발생했습니다.', 500);
  }
}

// --- 词汇列表生成 ---

export async function generateVocabularyList(
  level: string,
  count: number
): Promise<Array<{ word: string; meaning: string; example: string }>> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are an expert English teacher. Generate a list of ${count} English vocabulary words for the CEFR level "${level}".
The output must be a valid JSON array of objects. Do not include any text or markdown formatting before or after the JSON array.
Each object in the array must have the following keys: "word", "meaning" (in Korean), and "example" (an English sentence).

Example format:
[
  {
    "word": "example",
    "meaning": "예시",
    "example": "This is an example sentence."
  }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 清理并解析 JSON
    const cleanedJson = responseText.replace(/```json\n|```/g, '').trim();
    const vocabularyList = JSON.parse(cleanedJson);

    return vocabularyList;

  } catch (error: any) {
    console.error('Gemini vocabulary generation error:', error);
    // 抛出错误，以便上层可以捕获并启用备用方案
    throw new ApiError(error.message || 'Gemini 어휘 목록 생성 중 오류가 발생했습니다.', 500);
  }
}