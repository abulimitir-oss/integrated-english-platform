'use client';

import { useState, useRef } from 'react';
import { englishAPI } from './api';
import type { LearningRecord } from './types';

export default function IntegratedLearning() {
  const [scenario, setScenario] = useState('');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [learningHistory, setLearningHistory] = useState<LearningRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleSpeechAnalysis(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 分析语音
  const handleSpeechAnalysis = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const result = await englishAPI.analyzeSpeech({
        audio: audioBlob,
        text: inputText,
      });

      if (result.success && result.data) {
        const record: LearningRecord = {
          id: `speech-${Date.now()}`,
          type: 'pronunciation',
          timestamp: new Date(),
          score: result.data.score,
          details: result.data,
        };
        
        setLearningHistory(prev => [...prev, record]);
        setFeedback(result.data.feedback);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Speech analysis error:', error);
      alert('음성 분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 发送对话
  const handleConversation = async () => {
    if (!inputText.trim() || !scenario) {
      alert('시나리오와 메시지를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const result = await englishAPI.conversation({
        scenario,
        message: inputText,
        history: [],
      });

      if (result.success && result.data) {
        const record: LearningRecord = {
          id: `conv-${Date.now()}`,
          type: 'conversation',
          timestamp: new Date(),
          details: {
            scenario,
            userMessage: inputText,
            aiResponse: result.data.response,
          },
        };
        
        setLearningHistory(prev => [...prev, record]);
        setFeedback(result.data.response);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Conversation error:', error);
      alert('대화 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 语法检查
  const handleGrammarCheck = async () => {
    if (!inputText.trim()) {
      alert('텍스트를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const result = await englishAPI.correctGrammar({
        text: inputText,
      });

      if (result.success && result.data) {
        const record: LearningRecord = {
          id: `grammar-${Date.now()}`,
          type: 'grammar',
          timestamp: new Date(),
          details: result.data,
        };
        
        setLearningHistory(prev => [...prev, record]);
        setFeedback(result.data.feedback);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Grammar check error:', error);
      alert('문법 검사 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">통합 영어 학습</h1>
        
        {/* 输入区域 */}
        <div className="mb-6 space-y-4">
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">시나리오 선택</option>
            <option value="coffee_shop">커피숍</option>
            <option value="restaurant">레스토랑</option>
            <option value="airport">공항</option>
            <option value="hotel">호텔</option>
          </select>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="영어로 메시지를 입력하세요..."
            className="w-full p-4 border rounded"
            rows={4}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleConversation}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            대화하기
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`flex-1 p-3 rounded ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white disabled:opacity-50`}
          >
            {isRecording ? '녹음 중지' : '음성으로 말하기'}
          </button>
          
          <button
            onClick={handleGrammarCheck}
            disabled={loading}
            className="flex-1 bg-purple-500 text-white p-3 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            문법 검사
          </button>
        </div>

        {/* 反馈区域 */}
        {feedback && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-2">피드백</h2>
            <p className="whitespace-pre-wrap">{feedback}</p>
          </div>
        )}

        {/* 学习历史 */}
        <div>
          <h2 className="text-xl font-bold mb-4">학습 기록</h2>
          <div className="space-y-4">
            {learningHistory.map((record) => (
              <div
                key={record.id}
                className="p-4 border rounded hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">
                    {record.type === 'conversation' && '대화'}
                    {record.type === 'pronunciation' && '발음'}
                    {record.type === 'grammar' && '문법'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {record.timestamp.toLocaleString()}
                  </span>
                </div>
                {record.score && (
                  <div className="mb-2">점수: {record.score}</div>
                )}
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(record.details, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}