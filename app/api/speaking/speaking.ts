import { SpeakingTask, SpeakingAttempt, PronunciationResult, SpeakingProgress } from '@/lib/types/speaking';
import { DialogueState, OpenAIRole } from '@/lib/types/openai';

class SpeakingService {
  private storage: Storage | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.storage = window.localStorage;
    }
  }

  private async handleApiError(error: any, customMessage: string): Promise<never> {
    console.error(customMessage, error);
    throw new Error(customMessage);
  }

  // 语音转文字 (现在由 /api/speaking 路由内部处理)
  // async transcribeAudio(audioBlob: Blob): Promise<string> {
  //   console.warn("transcribeAudio is now handled internally by the /api/speaking route.");
  //   return "Transcription handled by API.";
  // }

  // 分析发音
  async analyzePronunciation(audioBlob: Blob, text: string): Promise<PronunciationResult[]> {
    // 创建 FormData 来发送音频和文本
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('text', text);

    try {
      const response = await fetch('/api/speaking', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      return this.handleApiError(error, 'Error analyzing pronunciation via API.');
    }
  }

  // 对话练习
  async continueDialogue(state: DialogueState, userAudio: Blob): Promise<{
    response: string;
    audioUrl: string;
    feedback: string;
  }> {
    // 1. 转写用户语音
    // 注意：对话功能也需要迁移到API路由中，这里为了聚焦发音分析的错误暂时省略。
    // 您可以创建一个 /api/speaking/dialogue 路由来处理。
    console.warn("continueDialogue needs to be migrated to an API route.");
    return Promise.reject({
        response: "Not implemented",
        audioUrl: "",
        feedback: "This function needs to be migrated to an API route.",
    });
  }

  // 保存练习记录
  async saveAttempt(attempt: SpeakingAttempt): Promise<void> {
    const key = `speaking_attempt_${attempt.id}`;
    this.storage?.setItem(key, JSON.stringify(attempt));
    
    // 更新进度
    const progress = this.getProgress(attempt.userId);
    if (progress) {
      progress.completedTasks.push(attempt.taskId);
      progress.totalPracticeTime += attempt.duration;
      progress.lastPracticeDate = new Date();
      
      if (attempt.score) {
        const { pronunciation, fluency, grammar, vocabulary, content } = attempt.score;
        progress.averageScores = {
          pronunciation: (progress.averageScores.pronunciation + pronunciation) / 2,
          fluency: (progress.averageScores.fluency + fluency) / 2,
          grammar: (progress.averageScores.grammar + grammar) / 2,
          vocabulary: (progress.averageScores.vocabulary + vocabulary) / 2,
          content: (progress.averageScores.content + content) / 2,
        };
      }
      
      this.saveProgress(progress);
    }
  }

  // 获取用户进度
  getProgress(userId: string): SpeakingProgress | null {
    const key = `speaking_progress_${userId}`;
    const data = this.storage?.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // 保存用户进度
  private saveProgress(progress: SpeakingProgress): void {
    const key = `speaking_progress_${progress.userId}`;
    this.storage?.setItem(key, JSON.stringify(progress));
  }

  // 解析AI的发音分析反馈
  private parseAIPronunciationFeedback(feedback: string): PronunciationResult[] {
    // 这里需要根据实际的AI反馈格式来实现解析逻辑
    // 当前返回一个示例结果
    return [
      {
        word: "example",
        score: 85,
        phonemes: [
          {
            expected: "ɪɡˈzæmpəl",
            actual: "ɪɡˈzæmpəl",
            score: 90
          }
        ],
        stress: {
          expected: [2],
          actual: [2],
          score: 100
        }
      }
    ];
  }
}

export const speakingService = new SpeakingService();