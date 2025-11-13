'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Volume2, StopCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

import { storage, ConversationHistory } from '@/lib/storage'

interface Props {
  scenario?: string
  initialHistory?: ConversationHistory | null
  onHistoryChange?: () => void
}

export default function ConversationInterface({ 
  scenario,
  initialHistory,
  onHistoryChange
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null)

  // 대화 내역 불러오기
  useEffect(() => {
    if (scenario && !initialHistory) {
      loadLatestConversation(scenario)
    }
  }, [scenario])

  // 초기 대화 내역 로드
  useEffect(() => {
    if (initialHistory) {
      setConversationId(initialHistory.id)
      setMessages(
        initialHistory.messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(initialHistory.timestamp)
        }))
      )
    }
  }, [initialHistory])

  // AudioContext 초기화
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      // 컴포넌트 언마운트 시 정리
      audioContextRef.current?.close()
      stopRecording()
      // 대화 내역 저장
      if (messages.length > 0 && scenario) {
        saveConversation()
      }
    }
  }, [])

  // 최근 대화 불러오기
  const loadLatestConversation = (currentScenario: string) => {
    const history = storage.getConversationHistory()
    const latestConversation = history.find(h => h.scenario === currentScenario)
    
    if (latestConversation) {
      setConversationId(latestConversation.id)
      setMessages(
        latestConversation.messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          timestamp: new Date(latestConversation.timestamp)
        }))
      )
    } else {
      // 새 대화 시작
      setConversationId(generateId())
      setMessages([])
    }
  }

  // 대화 저장
  const saveConversation = () => {
    if (!scenario || messages.length === 0) return

    const conversation: ConversationHistory = {
      id: conversationId || generateId(),
      scenario,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      timestamp: new Date()
    }

    storage.addConversationHistory(conversation)
  }

  // ID 생성 헬퍼
  const generateId = () => {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const handleSend = async () => {
    if (!input.trim() || !scenario) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    const updatedMessagesWithUser = [...messages, userMessage]; // 包含用户消息
    setMessages(updatedMessagesWithUser);
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          message: input,
          history: updatedMessagesWithUser.map(m => ({ role: m.role, content: m.content })), // API history should include the current message
        }),
      })

      if (!response.ok) {
        // 如果响应不是 OK，读取文本内容以获取详细错误信息
        const errorText = await response.text();
        console.error('API 响应错误 (非 JSON):', errorText);
        // 尝试解析 JSON，如果失败则使用通用错误消息
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `服务器错误: ${response.status}`);
        } catch {
          throw new Error(`服务器返回非 JSON 错误: ${response.status} - ${errorText.substring(0, 100)}...`);
        }
      }
      const data = await response.json();

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      
      // 将用户消息和 AI 消息一起更新到状态中
      setMessages(prev => [...prev, aiMessage]);

      // 대화 자동 저장
      const conversation: ConversationHistory = {
        id: conversationId || generateId(),
        scenario,
        messages: [...updatedMessagesWithUser, aiMessage].map(m => ({ role: m.role, content: m.content })), // 保存所有消息
        timestamp: new Date()
      }
      storage.addConversationHistory(conversation)
      
      // 대화 내역이 변경되었음을 부모 컴포넌트에 알림
      onHistoryChange?.()
      if (!conversationId) setConversationId(conversation.id);

    } catch (error) {
      console.error('Error sending message:', error);
      if (error instanceof Error) {
        // 使用更友好的错误提示
        const friendlyMessage = error.message.includes('404') 
          ? '대화 API를 찾을 수 없습니다. (404 Not Found)' 
          : '메시지 전송 중 오류가 발생했습니다.';
        alert(friendlyMessage);
      } else {
        alert('메시지 전송 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await handleAudioSubmission(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('마이크 접근 권한이 필요합니다.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleAudioSubmission = async (audioBlob: Blob) => {
    setIsLoading(true)

    try {
      // 确保音频文件不为空且大小合适
      if (audioBlob.size === 0) {
        throw new Error('녹음된 음성이 없습니다.')
      }
      if (audioBlob.size > 25 * 1024 * 1024) {
        throw new Error('음성 파일이 너무 큽니다. 25MB 이하로 녹음해주세요.')
      }

      const formData = new FormData()
      // 添加音频文件，使用合适的文件名和MIME类型
      formData.append('audio', new File([audioBlob], 'recording.webm', { type: 'audio/webm' }))
      formData.append('text', messages[messages.length - 1]?.content || '')

      const response = await fetch('/api/speech', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 响应错误 (非 JSON):', errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `服务器错误: ${response.status}`);
        } catch {
          throw new Error(`服务器返回非 JSON 错误: ${response.status} - ${errorText.substring(0, 100)}...`);
        }
      }
      const data = await response.json();

      // 인식된 텍스트를 입력 필드에 설정
      setInput(data.transcription)
      
      // 발음 피드백이 있으면 표시
      if (data.feedback) {
        const feedbackMessage: Message = {
          role: 'assistant',
          content: `🎯 발음 피드백: ${data.feedback} (점수: ${data.score}/100)`,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, feedbackMessage])
      }
    } catch (error) {
      console.error('Error submitting audio:', error);
      if (error instanceof Error && error.message.includes('음성을 텍스트로 변환하지 못했습니다')) {
        // 如果错误是“未能将语音转换为文本”，则显示“请重新输入”
        alert('인식된 음성이 없습니다. 다시 입력해주세요. (请重新输入)');
      } else {
        alert('음성 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  const playAudio = async (text: string) => {
    try {
      // 기존 재생 중인 오디오 정지
      audioSourceRef.current?.stop()
      
      // 새 AudioContext 생성 또는 재개
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // TODO: TTS API 호출하여 오디오 데이터 가져오기
      const response = await fetch('https://api.example.com/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
      
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      audioSourceRef.current = source
      
      source.start(0)
    } catch (error) {
      console.error('Error playing audio:', error)
      alert('음성 재생 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12">
            <p>상황을 선택하고 대화를 시작하세요</p>
            <p className="text-sm mt-2">텍스트나 음성으로 입력할 수 있습니다</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p>{message.content}</p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => playAudio(message.content)}
                      className="ml-2 p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleVoiceInput}
          className={`p-3 rounded-lg transition-colors ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title={isRecording ? '녹음 중지' : '음성으로 말하기'}
        >
          {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
          disabled={isRecording}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        <button
          onClick={handleSend}
          disabled={!input.trim() || isRecording || isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} className={isLoading ? 'animate-pulse' : ''} />
        </button>
      </div>
    </div>
  )
}
