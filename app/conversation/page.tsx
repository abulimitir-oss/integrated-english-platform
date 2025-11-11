'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import ScenarioSelector from '@/components/conversation/ScenarioSelector'
import ConversationInterface from '@/components/conversation/ConversationInterface'
import ConversationHistoryList from '@/components/conversation/ConversationHistory'
import type { ConversationHistory } from '@/lib/storage'

export default function ConversationPage() {
  const { t } = useLanguage()
  const [selectedScenario, setSelectedScenario] = useState<string>('')
  const [selectedHistory, setSelectedHistory] = useState<ConversationHistory | null>(null)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            💬 {t('conversation')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {t('conversationSubDesc')}
          </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ScenarioSelector 
              onSelectScenario={setSelectedScenario}
              selectedScenario={selectedScenario}
            />
            {selectedScenario && (
              <ConversationHistoryList 
                scenario={selectedScenario}
                onSelect={(conv) => {
                  setSelectedHistory(conv)
                }}
                currentId={selectedHistory?.id}
              />
            )}
          </div>
          <div className="lg:col-span-2">
            <ConversationInterface 
              scenario={selectedScenario} 
              initialHistory={selectedHistory}
              onHistoryChange={() => setSelectedHistory(null)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
