'use client'

import { useState, useEffect, useRef } from 'react'
import { SpeakingTask, SpeakingAttempt, PronunciationResult } from '@/lib/types/speaking'
import { speakingService } from '@/lib/services/speaking'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  task: SpeakingTask
  userId: string
}

export default function SpeakingPractice({ task, userId }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<PronunciationResult[] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // 清理函数
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('无法访问麦克风。请确保已授予麦克风访问权限。')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const analyzeRecording = async () => {
    if (!audioBlob) return

    setIsAnalyzing(true)
    try {
      const results = await speakingService.analyzePronunciation(audioBlob, task.textPrompt)
      setAnalysis(results)

      // 保存练习记录
      const attempt: SpeakingAttempt = {
        id: uuidv4(),
        taskId: task.id,
        userId,
        audioUrl: audioUrl || '',
        timestamp: new Date(),
        duration: 0, // 需要计算实际持续时间
        score: {
          pronunciation: results.reduce((acc, r) => acc + r.score, 0) / results.length,
          fluency: 0, // 需要从AI分析中获取
          grammar: 0,
          vocabulary: 0,
          content: 0,
          total: 0
        }
      }

      await speakingService.saveAttempt(attempt)
    } catch (error) {
      console.error('Error analyzing recording:', error)
      setFeedback('分析录音时出错。请重试。')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        {/* 任务信息 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {task.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {task.description}
          </p>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {task.difficulty}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              预计时长: {task.expectedDuration}秒
            </span>
          </div>
        </div>

        {/* 提示文本 */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-lg text-gray-800 dark:text-gray-200">
            {task.textPrompt}
          </p>
        </div>

        {/* 录音控制 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRecording ? '停止录音' : '开始录音'}
          </button>
          
          {audioUrl && !isRecording && (
            <button
              onClick={analyzeRecording}
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isAnalyzing ? '分析中...' : '分析录音'}
            </button>
          )}
        </div>

        {/* 音频播放器 */}
        {audioUrl && (
          <div className="mb-8">
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}

        {/* 分析结果 */}
        {analysis && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              分析结果
            </h3>
            
            {analysis.map((result, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {result.word}
                  </span>
                  <span className={`text-lg font-bold ${
                    result.score >= 90
                      ? 'text-green-600 dark:text-green-400'
                      : result.score >= 70
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {result.score}分
                  </span>
                </div>

                {/* 只有在 phonemes 数组存在且不为空时才渲染音标信息 */}
                {result.phonemes && result.phonemes.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        期望音标:
                      </span>
                      <span className="text-sm font-mono">
                        {result.phonemes[0].expected}
                      </span>
                    </div>
                    
                    <div className="flex gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        实际音标:
                      </span>
                      <span className="text-sm font-mono">
                        {result.phonemes[0].actual}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

        {/* 错误反馈 */}
        {feedback && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {feedback}
          </div>
        )}
      </div>
    </div>
  )
}