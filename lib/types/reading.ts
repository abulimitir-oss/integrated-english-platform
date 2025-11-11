export type ReadingLevel = 'TOEIC' | 'TOEFL' | 'SAT' | 'IELTS' | 'General'
export type ReadingCategory = 'Business' | 'Science' | 'Technology' | 'Culture' | 'Academic'

export interface Article {
  id: string
  title: string
  content: string
  level: ReadingLevel
  category: ReadingCategory
  estimatedTime: number // 预计阅读时间（分钟）
  questions: Question[]
  vocabulary: Vocabulary[]
}

export interface Question {
  id: string
  type: 'MCQ' | 'TrueFalse' | 'ShortAnswer' // 题目类型：选择题、判断题、简答题
  text: string
  options?: string[] // 选择题选项
  correctAnswer: string
  explanation: string
}

export interface Vocabulary {
  word: string
  meaning: string
  pronunciation: string
  partOfSpeech: string // 词性
  example: string
  synonyms: string[]
}

export interface ReadingProgress {
  articleId: string
  completed: boolean
  score: number
  timeSpent: number
  timestamp: Date
  answers: {
    questionId: string
    userAnswer: string
    correct: boolean
  }[]
  reviewedVocabulary: string[] // 已复习的单词列表
}