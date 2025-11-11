export interface SpeakingTask {
  id: string;
  type: 'pronunciation' | 'dialogue' | 'presentation';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioPrompt?: string;
  textPrompt: string;
  expectedDuration: number; // 预期时长(秒)
  scoreRubric: {
    pronunciation: number;
    fluency: number;
    grammar: number;
    vocabulary: number;
    content: number;
  };
  tags: string[];
}

export interface SpeakingAttempt {
  id: string;
  taskId: string;
  userId: string;
  audioUrl: string;
  timestamp: Date;
  duration: number;
  score?: {
    pronunciation: number;
    fluency: number;
    grammar: number;
    vocabulary: number;
    content: number;
    total: number;
  };
  aiFeedback?: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    detailedAnalysis: string;
  };
}

export interface PronunciationResult {
  word: string;
  score: number; // 0-100
  phonemes: {
    expected: string;
    actual: string;
    score: number;
  }[];
  stress: {
    expected: number[];
    actual: number[];
    score: number;
  };
}

export interface DialogueState {
  currentTurn: number;
  speakerRole: 'user' | 'ai';
  context: string;
  history: {
    speaker: 'user' | 'ai';
    text: string;
    audioUrl?: string;
  }[];
}

export interface SpeakingProgress {
  userId: string;
  completedTasks: string[];
  totalPracticeTime: number;
  averageScores: {
    pronunciation: number;
    fluency: number;
    grammar: number;
    vocabulary: number;
    content: number;
  };
  streak: number;
  lastPracticeDate: Date;
}