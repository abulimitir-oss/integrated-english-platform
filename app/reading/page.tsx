'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Article, ReadingLevel, ReadingCategory } from '@/lib/types/reading'
import { readingService } from '@/lib/services/reading'

export default function ReadingPage() {
  const { t } = useLanguage()
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedLevel, setSelectedLevel] = useState<ReadingLevel | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<ReadingCategory | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Article[]>([])

  useEffect(() => {
    loadArticles()
    loadRecommendations()
  }, [selectedLevel, selectedCategory])

  const levels: Array<{id: ReadingLevel, name: string}> = [
    { id: 'TOEIC', name: 'TOEIC' },
    { id: 'TOEFL', name: 'TOEFL' },
    { id: 'SAT', name: 'SAT' },
    { id: 'IELTS', name: t('ielts') },
    { id: 'General', name: t('general') }
  ]
  
  const categories: Array<{id: ReadingCategory, name: string}> = [
    { id: 'Business', name: t('business') },
    { id: 'Science', name: t('science') },
    { id: 'Technology', name: t('technology') },
    { id: 'Culture', name: t('culture') },
    { id: 'Academic', name: t('academic') }
  ]

  useEffect(() => {
    loadArticles()
    loadRecommendations()
  }, [selectedLevel, selectedCategory])

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const data = await readingService.getArticles(selectedLevel, selectedCategory)
      setArticles(data)
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecommendations = async () => {
    try {
      const recommended = await readingService.getRecommendedArticles()
      setRecommendations(recommended)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          📖 {t('reading')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t('readingSubDesc2')}
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('testType')}</h3>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('topic')}</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('recommendedReading')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((article) => (
                <div
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                    {article.level}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {article.content.substring(0, 120)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {t('estimatedTime')}: {article.estimatedTime}분
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      {t('startReading')} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles List */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <p>{t('noArticlesFound')}</p>
              <p className="mt-2">{t('tryDifferentFilters')}</p>
            </div>
          ) : (
            articles.map((article) => (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex space-x-2 mb-2">
                      <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {article.level}
                      </span>
                      <span className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {article.title}
                    </h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {article.estimatedTime}분
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {article.content.substring(0, 200)}...
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{t('questions')}: {article.questions.length}개</span>
                    <span>{t('words')}: {article.vocabulary.length}개</span>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all">
                    {t('startReading')} →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
