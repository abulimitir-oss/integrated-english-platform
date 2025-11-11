import OpenAI from 'openai'
import { ApiError } from './errors'

let openai: OpenAI;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // 这个错误是关键性的，如果发生，说明服务器环境配置不正确
      console.error('CRITICAL: OpenAI API key is not defined in environment variables.');
      throw new ApiError('OpenAI API 키가 서버에 설정되지 않았습니다.', 500);
    }
    openai = new OpenAI({
      apiKey,
      organization: process.env.OPENAI_ORG_ID,
    });
  }
  return openai;
}

export async function correctGrammar(text: string): Promise<{
  corrected: string
  feedback: string
  errors: Array<{
    original: string
    corrected: string
    explanation: string
  }>
}> {
  try {
    const client = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English grammar tutor. Correct grammar errors and provide detailed feedback in Korean.',
        },
        {
          role: 'user',
          content: `Please correct the following English text and provide detailed feedback:\n\n${text}`,
        },
      ],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content || ''
    
    // TODO: 응답 내용을 파싱하여 구조화된 데이터 반환
    return {
      corrected: text, // 임시 반환값
      feedback: content,
      errors: [],
    }
  } catch (error) {
    console.error('Grammar correction error:', error)
    throw error
  }
}

export async function generateConversation(scenario: string, userMessage: string, history: Array<{role: string, content: string}>): Promise<string> {
  try {
    const client = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful English conversation partner in a ${scenario} scenario. Respond naturally and helpfully in English.`,
        },
        ...(history || []).map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: userMessage,
        }
      ],
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('AI 응답이 비어있습니다.')
    }
    return content
  } catch (error: any) {
    // 打印更详细的错误信息以帮助调试
    console.error('Conversation generation error:', { message: error.message, status: error.status, code: error.code, type: error.type, name: error.name });
    if (error instanceof OpenAI.APIError) {
      // 来自 OpenAI SDK 的已知错误
      const status = error.status || 500;
      if (status === 401) {
        throw new ApiError('OpenAI API 키가 유효하지 않습니다. 환경 설정을 확인해주세요.', 401);
      }
      // 对于其他 API 错误 (如速率限制、服务器错误等)，可以抛出更通用的消息
      throw new ApiError(error.message || 'OpenAI API 처리 중 오류가 발생했습니다.', status);
    }
    // 将原始的 status 和 message 传递出去
    throw new ApiError(error.message || '대화 생성 중 알 수 없는 오류가 발생했습니다.', error.status || 500)
  }
}

export async function analyzePronunciation(audioBlob: Blob, expectedText: string): Promise<{
  score: number
  feedback: string
  transcription: string
}> {
  try {
    const client = getOpenAIClient();
    // 将 Blob 转换为 File 对象
    const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

    // 使用 Whisper API 进行语音转写
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en'
    });

    // 使用 GPT-4 评估发音
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English pronunciation evaluator. Compare the transcribed text with the expected text and provide detailed feedback in Korean. Focus on pronunciation accuracy, clarity, and naturalness.'
        },
        {
          role: 'user',
          content: `Expected text: "${expectedText}"\nTranscribed text: "${transcription.text}"\nPlease evaluate the pronunciation and provide a score (0-100) and detailed feedback in Korean.`
        }
      ],
      temperature: 0.3
    });

    const evaluation = response.choices[0]?.message?.content || '';
    const scoreMatch = evaluation.match(/(\d+)\/100/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    return {
      score,
      feedback: evaluation.replace(/\d+\/100[:\s]*/, '').trim(),
      transcription: transcription.text
    };
  } catch (error) {
    console.error('Pronunciation analysis error:', error);
    if (error instanceof Error) {
      throw new Error('음성 분석 중 오류가 발생했습니다: ' + error.message);
    }
    throw new Error('음성 분석 중 알 수 없는 오류가 발생했습니다.');
  }
}
