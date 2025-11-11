// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 对话相关类型
export interface ConversationRequest {
  scenario: string;
  message: string;
  history: Array<{
    role: string;
    content: string;
  }>;
}

export interface ConversationResponse {
  response: string;
}

// 语音相关类型
export interface SpeechRequest {
  audio: Blob;
  text: string;
}

export interface SpeechResponse {
  transcription: string;
  feedback: string;
  score: number;
}

// 语法相关类型
export interface GrammarRequest {
  text: string;
}

export interface GrammarResponse {
  corrected: string;
  feedback: string;
  errors: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
}

// TTS 相关类型
export interface TTSRequest {
  text: string;
  voice?: string;
}

export interface TTSResponse {
  audioUrl: string;
}

// 统一的学习记录类型
export interface LearningRecord {
  id: string;
  type: 'conversation' | 'pronunciation' | 'grammar';
  timestamp: Date;
  score?: number;
  details: any;
}