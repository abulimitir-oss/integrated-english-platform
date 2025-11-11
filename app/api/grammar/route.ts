import { NextResponse } from 'next/server';

// 模拟 AI 处理延迟
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const { text } = await request.json();

  // 模拟 AI 分析过程
  await sleep(1500);

  // 这是一个模拟的 AI 反馈。实际应用中，这里会调用真正的 AI 模型 API
  const mockFeedback = {
    corrections: [
      {
        original: "I go to school yesterday.",
        corrected: "I went to school yesterday.",
        explanation: "The past tense of 'go' is 'went'. Since the sentence refers to 'yesterday', the past tense should be used."
      },
      {
        original: "He don't like apple.",
        corrected: "He doesn't like apples.",
        explanation: "For the third-person singular ('He'), use 'doesn't' instead of 'don't'. Also, 'apple' should be plural 'apples' when speaking generally."
      }
    ],
    summary: "你的文章在时态和主谓一致方面有一些小错误。总体来说，结构清晰，表达流畅。继续努力！"
  };

  return NextResponse.json(mockFeedback);
}