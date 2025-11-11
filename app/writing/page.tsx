'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import WritingEditor from '@/components/writing/WritingEditor'
import WritingFeedback from '@/components/writing/WritingFeedback'

// 定义反馈数据的类型
export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface FeedbackData {
  corrections: Correction[];
  summary: string;
}

export default function WritingPage() {
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckGrammar = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    const response = await fetch('/api/grammar', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    const data: FeedbackData = await response.json();
    setFeedback(data);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          ✍️ {t('writing')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t('writingSubDesc')}
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <WritingEditor 
            text={text}
            setText={setText}
            onSubmit={handleCheckGrammar}
            isLoading={isLoading}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <WritingFeedback feedback={feedback} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
