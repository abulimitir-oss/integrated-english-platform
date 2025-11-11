'use client'

import { useState, useEffect } from 'react'
import { Article, Question, Vocabulary } from '@/lib/types/reading'
import { readingService } from '@/lib/services/reading'

interface Props {
  articleId: string
}

export default function ArticleReader({ articleId }: Props) {
  const [article, setArticle] = useState<Article | null>(null)
  const [currentSection, setCurrentSection] = useState<'reading' | 'questions' | 'vocabulary'>('reading')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showAnswers, setShowAnswers] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    loadArticle()
  }, [articleId])

  useEffect(() => {
    if (article && !startTime) {
      setStartTime(new Date())
    }
  }, [article])

  const loadArticle = async () => {
    setIsLoading(true)
    try {
      const data = await readingService.getArticle(articleId)
      if (data) {
        setArticle(data)
      }
    } catch (error) {
      console.error('Error loading article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const calculateScore = () => {
    if (!article) return 0
    let correct = 0
    article.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / article.questions.length) * 100)
  }

  const handleSubmit = () => {
    if (!article || !startTime) return

    const score = calculateScore()
    const endTime = new Date()
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60) // 分钟

    readingService.saveProgress({
      articleId,
      completed: true,
      score,
      timeSpent,
      timestamp: endTime,
      answers: article.questions.map(q => ({
        questionId: q.id,
        userAnswer: answers[q.id] || '',
        correct: answers[q.id] === q.correctAnswer
      })),
      reviewedVocabulary: []
    })

    setShowAnswers(true)
  }

  const saveWord = (word: string) => {
    if (articleId) {
      readingService.saveVocabulary(articleId, word)
    }
  }

  if (isLoading || !article) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Navigation */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setCurrentSection('reading')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentSection === 'reading'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          본문
        </button>
        <button
          onClick={() => setCurrentSection('questions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentSection === 'questions'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          문제 ({article.questions.length})
        </button>
        <button
          onClick={() => setCurrentSection('vocabulary')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentSection === 'vocabulary'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          단어장 ({article.vocabulary.length})
        </button>
      </div>

      {/* Content */}
      {currentSection === 'reading' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {article.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {currentSection === 'questions' && (
        <div className="space-y-8">
          {article.questions.map((question, idx) => (
            <div key={question.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {idx + 1}. {question.text}
              </h3>
              
              {question.type === 'MCQ' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        answers[question.id] === option
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswer(question.id, option)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'TrueFalse' && (
                <div className="flex space-x-4">
                  {['true', 'false'].map((value) => (
                    <label
                      key={value}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        answers[question.id] === value
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={value}
                        checked={answers[question.id] === value}
                        onChange={() => handleAnswer(question.id, value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 capitalize">{value}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'ShortAnswer' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder="답변을 입력하세요..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              )}

              {showAnswers && (
                <div className="mt-4">
                  <p className={`text-sm font-medium ${
                    answers[question.id] === question.correctAnswer
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {answers[question.id] === question.correctAnswer ? '정답' : '오답'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}

          {!showAnswers && (
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
              >
                답안 제출
              </button>
            </div>
          )}

          {showAnswers && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                결과
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {calculateScore()}점
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                총 {article.questions.length}문제 중{' '}
                {article.questions.filter(q => answers[q.id] === q.correctAnswer).length}문제 정답
              </p>
            </div>
          )}
        </div>
      )}

      {currentSection === 'vocabulary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {article.vocabulary.map((word) => (
            <div
              key={word.word}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {word.word}
                </h3>
                <button
                  onClick={() => saveWord(word.word)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  저장 +
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-3">
                {word.pronunciation} · {word.partOfSpeech}
              </p>
              
              <p className="text-gray-900 dark:text-white mb-3">
                {word.meaning}
              </p>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {word.example}
              </p>
              
              {word.synonyms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym) => (
                    <span
                      key={synonym}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}