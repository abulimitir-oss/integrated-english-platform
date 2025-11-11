import { useState, useEffect } from 'react'
import { storage, ConversationHistory } from '@/lib/storage'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Clock, MessageSquare, Trash2 } from 'lucide-react'

interface Props {
  scenario: string
  onSelect: (conversation: ConversationHistory) => void
  currentId?: string
}

export default function ConversationHistoryList({ scenario, onSelect, currentId }: Props) {
  const [conversations, setConversations] = useState<ConversationHistory[]>([])

  useEffect(() => {
    loadConversations()
  }, [scenario])

  const loadConversations = () => {
    const history = storage.getConversationHistory()
    const filtered = history.filter(h => h.scenario === scenario)
    setConversations(filtered)
  }

  const deleteConversation = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const history = storage.getConversationHistory()
    const updated = history.filter(h => h.id !== id)
    localStorage.setItem('conversationHistory', JSON.stringify(updated))
    loadConversations()
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        <p>이전 대화가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">
        이전 대화 기록
      </h3>
      
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv)}
          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
            currentId === conv.id
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <MessageSquare size={16} className="text-gray-500" />
              <span className="text-sm text-gray-900 dark:text-white">
                {conv.messages[0]?.content.substring(0, 30)}...
              </span>
            </div>
            <button
              onClick={(e) => deleteConversation(conv.id, e)}
              className="p-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            {formatDistanceToNow(new Date(conv.timestamp), {
              addSuffix: true,
              locale: ko
            })}
          </div>
        </div>
      ))}
    </div>
  )
}