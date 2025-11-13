import {
  generateConversation as generateConversationOpenAI,
  correctGrammar as correctGrammarOpenAI,
  analyzePronunciation as analyzePronunciationOpenAI,
} from './openai';
import { generateGeminiConversation as generateConversationGemini } from './gemini';

// 根据环境变量选择 AI 提供商
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 默认使用 OpenAI

console.log(`Using AI Provider: ${AI_PROVIDER}`);

export async function generateConversation(
  scenario: string,
  userMessage: string,
  history: Array<{ role: string; content: string }>
): Promise<string> {
  if (AI_PROVIDER === 'gemini') {
    return generateConversationGemini(scenario, userMessage, history);
  } else {
    return generateConversationOpenAI(scenario, userMessage, history);
  }
}

// TODO: 针对 correctGrammar 和 analyzePronunciation 也创建类似的抽象
// export async function correctGrammar(text: string): Promise<any> {
//   if (AI_PROVIDER === 'gemini') { /* 调用 Gemini 的语法纠正 */ } else { return correctGrammarOpenAI(text); }
// }
// export async function analyzePronunciation(audioBlob: Blob, expectedText: string): Promise<any> {
//   if (AI_PROVIDER === 'gemini') { /* 调用 Gemini 的发音分析 */ } else { return analyzePronunciationOpenAI(audioBlob, expectedText); }
// }