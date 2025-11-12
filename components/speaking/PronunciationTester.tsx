'use client';

import { useState, ChangeEvent, FC } from 'react';
import { speakingService } from '@/lib/services/speaking';

// 定义从 /api/speaking 期望获得的JSON对象的类型
interface AnalysisResult {
  accuracyScore: number;
  fluencyScore: number;
  wordDetails: {
    word: string;
    accuracy: number;
    feedback: string;
  }[];
}

const PronunciationTester: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  // 为参考文本提供一个默认值，与 123.mp3 内容匹配
  const [referenceText, setReferenceText] = useState<string>(
    'Stress in English tend to recur at regular intervals of time. It\'s often perfectly possible to tap on the stress in time with a metronome.'
  );
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !referenceText.trim()) {
      setError('请选择一个 MP3 文件并输入参考文本。');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 使用我们之前修改过的 service 方法
      // 它现在可以接受第三个参数作为文件名
      const analysisResult = await speakingService.analyzePronunciation(
        file,
        referenceText,
        file.name // 传递文件名，例如 "123.mp3"
      );
      setResult(analysisResult as unknown as AnalysisResult);
    } catch (err: any) {
      setError(`分析失败: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-speaking-dark dark:text-speaking-light">
        发音功能测试工具
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            上传 MP3 音频文件
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".mp3"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-speaking-light file:text-speaking-dark hover:file:bg-speaking-DEFAULT"
          />
        </div>
        <div>
          <label htmlFor="reference-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            参考文本
          </label>
          <textarea
            id="reference-text"
            value={referenceText}
            onChange={(e) => setReferenceText(e.target.value)}
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-speaking-light focus:border-speaking-light dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="请输入音频对应的英文文本..."
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !file}
          className="w-full px-4 py-2 text-white font-semibold bg-speaking-DEFAULT rounded-md hover:bg-speaking-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? '正在分析中...' : '开始分析'}
        </button>
      </div>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {result && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">分析结果</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-primary-100 rounded-lg">
              <div className="text-3xl font-bold text-primary-700">{result.accuracyScore}</div>
              <div className="text-sm text-primary-600">准确度得分</div>
            </div>
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-700">{result.fluencyScore}</div>
              <div className="text-sm text-green-600">流利度得分</div>
            </div>
          </div>

          {/* 单词详细分析 */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">单词详情分析</h4>
            <div className="space-y-3">
              {result.wordDetails.map((detail, index) => (
                <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">{detail.word}</span>
                    <span className={`font-bold text-lg ${
                      detail.accuracy >= 90
                        ? 'text-green-600 dark:text-green-400'
                        : detail.accuracy >= 70
                        ? 'text-yellow-500 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-500'
                    }`}>
                      {detail.accuracy}分
                    </span>
                  </div>
                  {detail.feedback && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">AI反馈:</span> {detail.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PronunciationTester;
