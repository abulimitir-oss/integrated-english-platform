// 통일된 데이터 저장 관리
// 각 플랫폼의 데이터 저장 요구를 통합

export interface UserProgress {
  streak: number
  lastDate: string
  totalDays: number
}

export interface SentenceHistory {
  id: string
  original: string
  corrected: string
  feedback: string
  timestamp: Date
}

export interface ConversationHistory {
  id: string
  scenario: string
  messages: Array<{ role: string; content: string }>
  timestamp: Date
}

export interface Vocabulary {
  id: string
  word: string
  meaning: string
  example: string
  level: string
  learned: boolean
  reviewDates: Date[]
}

export interface UserLevel {
  level: string
  date: string
  score: number
}

class StorageManager {
  // User Progress
  getProgress(): UserProgress {
    const stored = localStorage.getItem('userProgress')
    return stored ? JSON.parse(stored) : { streak: 0, lastDate: '', totalDays: 0 }
  }

  setProgress(progress: UserProgress): void {
    localStorage.setItem('userProgress', JSON.stringify(progress))
  }

  // Sentence History
  getSentenceHistory(): SentenceHistory[] {
    const stored = localStorage.getItem('sentenceHistory')
    return stored ? JSON.parse(stored) : []
  }

  addSentenceHistory(item: SentenceHistory): void {
    const history = this.getSentenceHistory()
    history.unshift(item)
    localStorage.setItem('sentenceHistory', JSON.stringify(history.slice(0, 100))) // 최근 100개 항목 보관
  }

  // Conversation History
  getConversationHistory(): ConversationHistory[] {
    const stored = localStorage.getItem('conversationHistory')
    return stored ? JSON.parse(stored) : []
  }

  addConversationHistory(item: ConversationHistory): void {
    const history = this.getConversationHistory()
    history.unshift(item)
    localStorage.setItem('conversationHistory', JSON.stringify(history.slice(0, 50))) // 최근 50개 항목 보관
  }

  // Vocabulary
  getVocabulary(): Vocabulary[] {
    const stored = localStorage.getItem('vocabulary')
    return stored ? JSON.parse(stored) : []
  }

  addVocabulary(item: Vocabulary): void {
    const vocabulary = this.getVocabulary()
    vocabulary.push(item)
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary))
  }

  // User Level
  getUserLevel(): UserLevel | null {
    const stored = localStorage.getItem('userLevel')
    return stored ? JSON.parse(stored) : null
  }

  setUserLevel(level: UserLevel): void {
    localStorage.setItem('userLevel', JSON.stringify(level))
  }

  // Clear all data
  clearAll(): void {
    localStorage.clear()
  }
}

export const storage = new StorageManager()

