import { Article, ReadingLevel, ReadingCategory, ReadingProgress } from '../types/reading'
import { sampleArticles } from '../data/articles'
import { storage } from './storage'

class ReadingService {
  // 获取文章列表
  async getArticles(level?: ReadingLevel, category?: ReadingCategory): Promise<Article[]> {
    // TODO: 在实际应用中，这将从API获取数据
    let articles = sampleArticles

    if (level) {
      articles = articles.filter(a => a.level === level)
    }
    if (category) {
      articles = articles.filter(a => a.category === category)
    }

    return articles
  }

  // 获取单篇文章详情
  async getArticle(id: string): Promise<Article | null> {
    return sampleArticles.find(a => a.id === id) || null
  }

  // 保存阅读进度
  saveProgress(progress: ReadingProgress): void {
    const history = this.getProgress()
    const existingIndex = history.findIndex(p => p.articleId === progress.articleId)
    
    if (existingIndex >= 0) {
      history[existingIndex] = progress
    } else {
      history.unshift(progress)
    }

    localStorage.setItem('readingProgress', JSON.stringify(history.slice(0, 100))) // 保留最近100条记录
  }

  // 获取阅读进度历史
  getProgress(): ReadingProgress[] {
    const stored = localStorage.getItem('readingProgress')
    return stored ? JSON.parse(stored) : []
  }

  // 获取特定文章的进度
  getArticleProgress(articleId: string): ReadingProgress | null {
    const history = this.getProgress()
    return history.find(p => p.articleId === articleId) || null
  }

  // 获取推荐文章
  async getRecommendedArticles(): Promise<Article[]> {
    const history = this.getProgress()
    const readArticleIds = new Set(history.map(p => p.articleId))
    
    // 筛选未读文章
    const unreadArticles = sampleArticles.filter(a => !readArticleIds.has(a.id))
    
    // TODO: 基于用户水平和兴趣进行更智能的推荐
    return unreadArticles.slice(0, 3)
  }

  // 保存生词
  saveVocabulary(articleId: string, word: string): void {
    const key = `vocabulary_${articleId}`
    const stored = localStorage.getItem(key)
    const words = stored ? JSON.parse(stored) : []
    
    if (!words.includes(word)) {
      words.push(word)
      localStorage.setItem(key, JSON.stringify(words))
    }
  }

  // 获取文章生词
  getVocabulary(articleId: string): string[] {
    const key = `vocabulary_${articleId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }
}

export const readingService = new ReadingService()