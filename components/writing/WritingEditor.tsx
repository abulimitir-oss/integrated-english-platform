'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Send, RotateCcw } from 'lucide-react'

interface WritingEditorProps {
  text: string;
  setText: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function WritingEditor({
  text,
  setText,
  onSubmit,
  isLoading,
}: WritingEditorProps) {
  const { t } = useLanguage()

  const handleReset = () => {
    setText('')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('writingPlaceholder')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('writingExample')}
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
        />
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('charCount')}: {text.length}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onSubmit}
          disabled={!text.trim() || isLoading}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
          <span>{isLoading ? t('processing') : t('check')}</span>
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={20} />
          <span>{t('reset')}</span>
        </button>
      </div>
    </div>
  )
}
