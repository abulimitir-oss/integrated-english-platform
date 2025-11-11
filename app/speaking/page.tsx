'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import SpeakingPractice from '@/components/speaking/SpeakingPractice'
import { SpeakingTask } from '@/lib/types/speaking'

export default function SpeakingPage() {
  const { t } = useLanguage()
  const [selectedTask, setSelectedTask] = useState<SpeakingTask | null>(null)
  const [filter, setFilter] = useState({
    type: 'all',
    difficulty: 'all'
  })

  const sampleTasks: SpeakingTask[] = [
    {
      id: '1',
      type: 'pronunciation',
      title: t('toeflPhonemePracticeTitle'),
      description: t('toeflPhonemePracticeDesc'),
      difficulty: 'beginner',
      textPrompt: 'The quick brown fox jumps over the lazy dog.',
      expectedDuration: 30,
      scoreRubric: {
        pronunciation: 40,
        fluency: 20,
        grammar: 20,
        vocabulary: 10,
        content: 10
      },
      tags: ['TOEFL', t('pronunciation'), t('phonemes')]
    },
    {
      id: '2',
      type: 'dialogue',
      title: t('ieltsDailyConversationTitle'),
      description: t('ieltsDailyConversationDesc'),
      difficulty: 'intermediate',
      textPrompt: 'Describe your favorite place to study. Why do you like it?',
      expectedDuration: 120,
      scoreRubric: {
        pronunciation: 20,
        fluency: 30,
        grammar: 20,
        vocabulary: 15,
        content: 15
      },
      tags: ['IELTS', t('speaking'), t('dailyConversation')]
    },
    {
      id: '3',
      type: 'presentation',
      title: t('businessEnglishPresentationTitle'),
      description: t('businessEnglishPresentationDesc'),
      difficulty: 'advanced',
      textPrompt: 'Present a brief overview of your company and its main products or services.',
      expectedDuration: 180,
      scoreRubric: {
        pronunciation: 15,
        fluency: 25,
        grammar: 20,
        vocabulary: 20,
        content: 20
      },
      tags: [t('business'), t('presentation'), 'professional']
    }
  ]

  const filteredTasks = sampleTasks.filter(task => {
    if (filter.type !== 'all' && task.type !== filter.type) return false
    if (filter.difficulty !== 'all' && task.difficulty !== filter.difficulty) return false
    return true
  })

  const difficultyMap = {
    beginner: t('beginner'),
    intermediate: t('intermediate'),
    advanced: t('advanced'),
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {selectedTask ? (
        <div>
          <button
            onClick={() => setSelectedTask(null)}
            className="mb-8 ml-8 px-4 py-2 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ← {t('backToList')}
          </button>
          <SpeakingPractice 
            task={selectedTask} 
            userId="demo-user" // 需要替换为实际的用户ID
          />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎤 {t('speaking')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {t('speakingSubDesc')}
          </p>

          {/* 过滤器 */}
          <div className="mb-8 flex gap-4">
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            >
              <option value="all">{t('allTypes')}</option>
              <option value="pronunciation">{t('pronunciationPractice')}</option>
              <option value="dialogue">{t('dialoguePractice')}</option>
              <option value="presentation">{t('presentationPractice')}</option>
            </select>

            <select
              value={filter.difficulty}
              onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value }))}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
            >
              <option value="all">{t('allDifficulties')}</option>
              <option value="beginner">{t('beginner')}</option>
              <option value="intermediate">{t('intermediate')}</option>
              <option value="advanced">{t('advanced')}</option>
            </select>
          </div>

          {/* 任务网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`w-2 h-2 rounded-full ${
                      task.difficulty === 'beginner'
                        ? 'bg-green-400'
                        : task.difficulty === 'intermediate'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`} />
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {difficultyMap[task.difficulty as keyof typeof difficultyMap]}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {task.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('estimatedDuration')}: {task.expectedDuration}秒
                    </span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {t('startPractice')} →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
