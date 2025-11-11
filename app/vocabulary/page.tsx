'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VocabularyWord, UserWordProgress } from '@/lib/types/vocabulary'; // 确保你已经创建了这个类型文件

// 简化的间隔重复算法
const sm2 = (progress: UserWordProgress, quality: number): UserWordProgress => {
  if (quality < 3) {
    // 回答错误，重置
    return { ...progress, repetitions: 0, interval: 1 };
  }

  let newInterval;
  if (progress.repetitions === 0) {
    newInterval = 1;
  } else if (progress.repetitions === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.ceil(progress.interval * progress.easeFactor);
  }

  const newEaseFactor = progress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    ...progress,
    repetitions: progress.repetitions + 1,
    interval: newInterval,
    easeFactor: Math.max(1.3, newEaseFactor),
    nextReviewDate: nextReview.toISOString(),
  };
};

export default function VocabularyPage() {
  const { t } = useLanguage();
  const [wordsToReview, setWordsToReview] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // 模拟从API获取需要复习的单词
  useEffect(() => {
    const fetchWords = async () => {
      setIsLoading(true);
      // 在实际应用中，这里会调用API获取用户的待复习单词列表
      // 这里我们为了演示，直接请求B1级别的单词
      // 现在，我们使用一个更高效的API调用
      try {
        const response = await fetch('/api/vocabulary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // 使用新的 action 'get-vocabulary-list'
          body: JSON.stringify({ action: 'get-vocabulary-list', payload: { level: 'B1', count: 5 } }),
        });
        const detailedWords: VocabularyWord[] = await response.json();
        setWordsToReview(detailedWords);
      } catch (error) {
        console.error("Failed to fetch vocabulary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  const currentWord = wordsToReview[currentWordIndex];

  const handleNextWord = () => {
    setShowAnswer(false);
    setCurrentWordIndex((prev) => (prev + 1) % wordsToReview.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          📚 {t('vocabulary')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {t('vocabularySubDesc')}
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 min-h-[400px] flex flex-col justify-center items-center">
          {isLoading && <p>{t('gettingCards')}</p>}
          {!isLoading && currentWord && (
            <div className="w-full text-center">
              <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400">{currentWord.word}</h2>
              <p className="text-xl text-gray-500 dark:text-gray-400 mt-2">{currentWord.ipa}</p>
              
              {showAnswer && (
                <div className="mt-6 text-left space-y-4 animate-fade-in">
                  <p><strong>{t('definition')}:</strong> {currentWord.definition}</p>
                  <p><strong>{t('translation')}:</strong> {currentWord.translation}</p>
                  <p><strong>{t('exampleSentence')}:</strong> <em>{currentWord.exampleSentence}</em></p>
                  {currentWord.mnemonic && <p><strong>{t('mnemonic')}:</strong> {currentWord.mnemonic}</p>}
                </div>
              )}

              <div className="mt-8">
                {showAnswer ? (
                  <button onClick={handleNextWord} className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors">{t('next')}</button>
                ) : (
                  <button onClick={() => setShowAnswer(true)} className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors">{t('showAnswer')}</button>
                )}
              </div>
            </div>
          )}
          {!isLoading && wordsToReview.length === 0 && <p>{t('allReviewsDone')}</p>}
        </div>
      </div>
    </div>
  )
}
