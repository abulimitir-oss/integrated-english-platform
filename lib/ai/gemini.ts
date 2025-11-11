import { GoogleGenerativeAI } from '@google/generative-ai';
import { ApiError } from './errors'; // 假设 ApiError 在 lib/ai/errors.ts 中定义
import { VocabularyWord } from '../types/vocabulary';

let genAI: GoogleGenerativeAI;

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: Gemini API key is not defined in environment variables.');
      throw new ApiError('Gemini API 키가 서버에 설정되지 않았습니다.', 500);
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateConversation(
  scenario: string,
  userMessage: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-pro' }); // 修正为稳定且有效的模型

    // 将历史消息转换为 Gemini 格式
    const geminiHistory = history.map(msg => {
      // Gemini API 的角色是 'user' 和 'model'
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return { role, parts: [{ text: msg.content }] };
    });

    const result = await model.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature: 0.7,
      },
    }).sendMessage(userMessage);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Gemini 응답이 비어있습니다.');
    }
    return text;
  } catch (error: any) {
    console.error('Gemini conversation generation error:', error);
    // 针对 Gemini API 的错误处理可能需要根据实际错误结构进行调整
    throw new ApiError(
      error.message || 'Gemini 대화 생성 중 알 수 없는 오류가 발생했습니다.',
      error.status || 500
    );
  }
}

export async function generateVocabularyList(
  level: string,
  count: number,
  language: string = '中文'
): Promise<VocabularyWord[]> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-pro' }); // 修正为稳定且有效的模型

    const prompt = `
      Please generate a list of ${count} English vocabulary words suitable for the CEFR level "${level}".
      For each word, provide its IPA transcription, definition in English, translation in ${language}, an example sentence, and a simple mnemonic.
      Your response MUST be a valid JSON array of objects, with no other text, explanations, or markdown formatting.
      Each object in the array should have the following structure: { "word": "...", "ipa": "...", "definition": "...", "translation": "...", "exampleSentence": "...", "mnemonic": "..." }.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 清理 Gemini 可能返回的 markdown 格式
    text = text.replace(/^```json\s*/, '').replace(/```$/, '').trim();

    if (!text) {
      throw new Error('Gemini returned an empty response for vocabulary list.');
    }

    // 解析 JSON 响应
    const vocabularyList: VocabularyWord[] = JSON.parse(text);

    if (!Array.isArray(vocabularyList) || vocabularyList.length === 0) {
      throw new Error('Failed to parse a valid vocabulary array from Gemini response.');
    }

    return vocabularyList;
  } catch (error: any) {
    console.error('Gemini vocabulary generation error:', error);

    // 针对 Google API 的特定错误进行更详细的诊断
    if (error.message && error.message.includes('404')) {
       console.error("A 404 error from Google suggests the 'Generative Language API' may not be enabled in your Google Cloud project. Please check https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
    }
    if (error.message && error.message.includes('API key not valid')) {
      console.error("The Gemini API key is not valid. Please check your .env.local file and ensure the key is correct and has not expired.");
    }

    throw new ApiError(
      error.message || 'An unknown error occurred while generating vocabulary with Gemini.',
      error.status || 500
    );
  }
}