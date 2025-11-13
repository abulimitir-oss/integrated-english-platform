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
    throw new Error(`${customMessage}: ${error.message || error}`); // 保留原始错误信息
  }

  // 语音转文字
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // 注意: Gemini API (generative-ai SDK) 不直接提供语音转文字功能。
    // 这里需要替换为 Google Cloud Speech-to-Text 或其他服务的实现。
    // 作为临时占位符，我们返回一个提示信息。
    console.warn("transcribeAudio is not implemented for Gemini. Using placeholder.");
    return "This is a placeholder for audio transcription as Gemini SDK doesn't support it directly.";
  }

  // 分析发音
  async analyzePronunciation(
    audioBlob: Blob,
    text: string,
    fileName: string = 'recording.webm' // 添加一个可选的文件名参数
  ): Promise<PronunciationResult[]> {
    // 创建 FormData 来发送音频和文本
    const formData = new FormData();
    // 使用传入的文件名，如果未提供，则默认为 'recording.webm'
    // 这使得我们可以处理 .mp3 或其他支持的格式
    formData.append('audio', audioBlob, fileName);
    formData.append('text', text);

    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // 尝试解析后端的JSON错误响应
        const errorData = await response.json();
        // 使用后端提供的具体错误信息，如果不存在则使用通用信息
        const errorMessage = errorData.error || `API error: ${response.statusText}`;
        throw new Error(errorMessage);
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