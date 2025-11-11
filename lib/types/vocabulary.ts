// lib/types/vocabulary.ts

/**
 * 表示一个词汇单词的基本结构
 */
export interface VocabularyWord {
  id: string;
  word: string;
  definition?: string;
  ipa?: string;
  translation?: string;
  exampleSentence?: string;
  mnemonic?: string;
  example?: string;
}

/**
 * 表示用户对特定单词的学习进度
 */
export interface UserWordProgress {
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewDate?: string;
}