'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { FeedbackData } from '@/app/writing/page'
import { Loader2 } from 'lucide-react'

interface Props {
  feedback: FeedbackData | null
  isLoading: boolean
}

export default function WritingFeedback({ feedback, isLoading }: Props) {
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Loader2 className="mx-auto animate-spin h-8 w-8 text-blue-500" />
        <p className="mt-2">{t('processing')}</p>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>{t('getFeedbackPrompt')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t('feedbackResult')}
      </h2>

      {/* 总结部分 */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('summary')}</h3>
        <p className="text-gray-700 dark:text-gray-300">{feedback.summary}</p>
      </div>

      {/* 纠错列表 */}
      <div className="space-y-4">
        {feedback.corrections.map((correction, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="mb-2">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">{t('originalText')}: </span>
              <span className="text-gray-600 dark:text-gray-400 line-through">{correction.original}</span>
            </div>
            <div className="mb-3">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('correctedText')}: </span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold">{correction.corrected}</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-semibold">{t('explanation')}: </span>
                {correction.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
