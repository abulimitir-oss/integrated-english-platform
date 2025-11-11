'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Users } from 'lucide-react'

export default function CommunityPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          👥 {t('community')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('communityDesc')}
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 min-h-[400px] flex flex-col justify-center items-center text-center">
          <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            {t('communityInProgress')}
          </h2>
        </div>
      </div>
    </div>
  )
}
