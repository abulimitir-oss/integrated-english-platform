'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  onSelectScenario: (scenario: string) => void
  selectedScenario?: string
}

export default function ScenarioSelector({ onSelectScenario, selectedScenario: propScenario }: Props) {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedScenario, setSelectedScenario] = useState<string | null>(propScenario || null)

  const scenarios = [
    // 일상생활 (8개)
    { id: 'cafe', name: t('cafe'), icon: '☕', category: 'daily' },
    { id: 'restaurant', name: t('restaurant'), icon: '🍽️', category: 'daily' },
    { id: 'shopping', name: t('shoppingMall'), icon: '🛍️', category: 'daily' },
    { id: 'hospital', name: t('hospital'), icon: '🏥', category: 'daily' },
    { id: 'post-office', name: t('postOffice'), icon: '📮', category: 'daily' },
    { id: 'bank', name: t('bank'), icon: '🏦', category: 'daily' },
    { id: 'gym', name: t('gym'), icon: '💪', category: 'daily' },
    { id: 'salon', name: t('hairSalon'), icon: '💇', category: 'daily' },
    // 여행 (5개)
    { id: 'airport', name: t('airport'), icon: '✈️', category: 'travel' },
    { id: 'hotel', name: t('hotel'), icon: '🏨', category: 'travel' },
    { id: 'tourist', name: t('touristSpot'), icon: '🗺️', category: 'travel' },
    { id: 'car-rental', name: t('rentalCar'), icon: '🚗', category: 'travel' },
    { id: 'train', name: t('trainStation'), icon: '🚄', category: 'travel' },
    // 학습과 업무 (5개)
    { id: 'interview', name: t('interview'), icon: '💼', category: 'work' },
    { id: 'meeting', name: t('meeting'), icon: '📊', category: 'work' },
    { id: 'class', name: t('class'), icon: '📚', category: 'work' },
    { id: 'library', name: t('library'), icon: '📖', category: 'work' },
    { id: 'presentation', name: t('presentation'), icon: '🎤', category: 'work' },
    // 사교 활동 (4개)
    { id: 'party', name: t('party'), icon: '🎉', category: 'social' },
    { id: 'date', name: t('date'), icon: '❤️', category: 'social' },
    { id: 'networking', name: t('networking'), icon: '🤝', category: 'social' },
    { id: 'phone', name: t('phone'), icon: '📞', category: 'social' },
    // 긴급 상황 (2개)
    { id: 'police', name: t('police'), icon: '👮', category: 'emergency' },
    { id: 'emergency', name: t('emergencyRoom'), icon: '🚑', category: 'emergency' },
    // 기타 (3-개)
    { id: 'real-estate', name: t('realEstate'), icon: '🏠', category: 'other' },
    { id: 'car-repair', name: t('carRepair'), icon: '🔧', category: 'other' },
    { id: 'pet-hospital', name: t('petHospital'), icon: '🐕', category: 'other' },
  ]

  const categories = [
    { id: 'all', name: t('all') },
    { id: 'daily', name: t('dailyLife') },
    { id: 'travel', name: t('travel') },
    { id: 'work', name: t('learningWork') },
    { id: 'social', name: t('socialActivities') },
    { id: 'emergency', name: t('emergency') },
    { id: 'other', name: t('etc') },
  ]

  const filteredScenarios = selectedCategory === 'all'
    ? scenarios
    : scenarios.filter(s => s.category === selectedCategory)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {t('selectSituation')}
      </h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Scenario List */}
      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => {
              setSelectedScenario(scenario.id)
              onSelectScenario(scenario.id)
            }}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedScenario === scenario.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-2xl mb-1">{scenario.icon}</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {scenario.name}
            </div>
          </button>
        ))}
      </div>

      {selectedScenario && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            {t('selected')}: {scenarios.find(s => s.id === selectedScenario)?.name}
          </p>
        </div>
      )}
    </div>
  )
}
