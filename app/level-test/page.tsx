'use client';

import { useState, useEffect } from 'react';
import fallbackQuestions from '@/lib/data/fallback-questions.json'; // 直接导入本地数据

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const QUESTIONS_PER_LEVEL = 3; // 각 레벨당 문제 수
const PASS_THRESHOLD = 0.66; // 다음 레벨로 넘어가기 위한 정답률 (예: 3문제 중 2문제)

export default function LevelTestPage() {
  const [testState, setTestState] = useState<'idle' | 'testing' | 'finished'>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [finalLevel, setFinalLevel] = useState<string | null>(null);

  const fetchQuestions = async (level: string) => {
    setIsLoading(true);
    // 模拟网络延迟，以提供更好的用户体验
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const levelKey = level.toUpperCase() as keyof typeof fallbackQuestions;
      const levelData = fallbackQuestions[levelKey] || fallbackQuestions.A1; // 如果找不到对应等级，则默认使用 A1
      const data = levelData.slice(0, QUESTIONS_PER_LEVEL);

      if (!data || data.length === 0) {
        throw new Error(`本地文件中没有找到等级 ${level} 的备用题目。`);
      }

      setQuestions(data);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
    } catch (error) {
      console.error(error);
      // 更新错误提示，告知用户问题源于本地文件
      alert('本地题目加载失败，请检查 fallback-questions.json 文件。');
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = () => {
    setCurrentLevelIndex(0);
    setScore(0);
    setFinalLevel(null);
    setTestState('testing');
    fetchQuestions(CEFR_LEVELS[0]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // 이미 답변 선택함

    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }

    // 다음 문제로 이동 또는 레벨 종료
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS_PER_LEVEL - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // 레벨 종료
        const levelScore = score + (answerIndex === questions[currentQuestionIndex].correctAnswerIndex ? 1 : 0);
        const accuracy = levelScore / ((currentLevelIndex * QUESTIONS_PER_LEVEL) + QUESTIONS_PER_LEVEL);
        
        if (accuracy >= PASS_THRESHOLD && currentLevelIndex < CEFR_LEVELS.length - 1) {
          // 다음 레벨로
          const nextLevelIndex = currentLevelIndex + 1;
          setCurrentLevelIndex(nextLevelIndex);
          fetchQuestions(CEFR_LEVELS[nextLevelIndex]);
        } else {
          // 테스트 종료
          let determinedLevel = CEFR_LEVELS[currentLevelIndex];
          if (accuracy < PASS_THRESHOLD && currentLevelIndex > 0) {
            determinedLevel = CEFR_LEVELS[currentLevelIndex - 1];
          } else if (accuracy < PASS_THRESHOLD && currentLevelIndex === 0) {
            determinedLevel = "A1 미만";
          }
          setFinalLevel(determinedLevel);
          setTestState('finished');
        }
      }
    }, 1000); // 1초 후 다음 문제로
  };

  const renderTestContent = () => {
    if (isLoading) {
      return <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto"></div><p className="mt-4">질문을 생성 중입니다...</p></div>;
    }

    if (questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div>
        <div className="text-right text-lg font-bold mb-4">
          {CEFR_LEVELS[currentLevelIndex]} Level - Question {currentQuestionIndex + 1} / {QUESTIONS_PER_LEVEL}
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">{currentQuestion.question}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = "bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600";
            if (selectedAnswer !== null) {
              if (index === currentQuestion.correctAnswerIndex) {
                buttonClass = "bg-green-500 text-white";
              } else if (index === selectedAnswer) {
                buttonClass = "bg-red-500 text-white";
              }
            }
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-lg text-left text-lg transition-colors duration-300 shadow ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">영어 실력 레벨 테스트</h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-8">CEFR A1~C2 레벨을 정확하게 평가해 보세요.</p>

      {testState === 'idle' && (
        <div className="text-center">
          <button
            onClick={startTest}
            className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            테스트 시작하기
          </button>
        </div>
      )}

      {testState === 'testing' && renderTestContent()}

      {testState === 'finished' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">테스트 완료!</h2>
          <p className="text-xl mb-6">당신의 예상 영어 레벨은...</p>
          <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-5xl font-extrabold p-8 rounded-full inline-block">
            {finalLevel}
          </div>
          <button
            onClick={startTest}
            className="mt-8 bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-700 transition-colors"
          >
            다시 테스트하기
          </button>
        </div>
      )}
    </div>
  );
}