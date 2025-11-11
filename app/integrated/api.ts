import {
  ConversationRequest,
  ConversationResponse,
  SpeechRequest,
  SpeechResponse,
  GrammarRequest,
  GrammarResponse,
  TTSRequest,
  TTSResponse,
  ApiResponse,
} from './types';

class EnglishLearningAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  // 对话功能
  async conversation(request: ConversationRequest): Promise<ApiResponse<ConversationResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('대화 생성 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Conversation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  // 语音分析功能
  async analyzeSpeech(request: SpeechRequest): Promise<ApiResponse<SpeechResponse>> {
    try {
      const formData = new FormData();
      formData.append('audio', request.audio);
      formData.append('text', request.text);

      const response = await fetch(`${this.baseUrl}/speech`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('음성 분석 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Speech analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '음성 처리 중 오류가 발생했습니다.',
      };
    }
  }

  // 语法纠正功能
  async correctGrammar(request: GrammarRequest): Promise<ApiResponse<GrammarResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/grammar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('문법 검사 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Grammar correction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '문법 검사 중 오류가 발생했습니다.',
      };
    }
  }

  // TTS 功能
  async textToSpeech(request: TTSRequest): Promise<ApiResponse<TTSResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('음성 변환 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('TTS error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '음성 변환 중 오류가 발생했습니다.',
      };
    }
  }
}

// 创建单例实例
export const englishAPI = new EnglishLearningAPI();