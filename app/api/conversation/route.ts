import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiConversation } from '@/lib/ai/gemini'; // 导入新的 Gemini 函数

export async function POST(request: NextRequest) {
  let body; // 将 body 声明移到 try-catch 外部
  try {
    body = await request.json(); // 在 try 块中赋值
    const { scenario, message, history } = body;

    // 1. 验证输入
    if (!scenario || !message) {
      return NextResponse.json(
        { error: 'Scenario and message are required.' },
        { status: 400 }
      );
    }

    // 2. 调用 OpenAI API 获取响应
    const aiResponse = await generateGeminiConversation(scenario, message, history);

    // 3. 返回成功的 JSON 响应
    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Error in /api/conversation:', error);
    console.error('Request body:', body); // 打印请求体，方便调试

    return NextResponse.json(
      { error: '대화 처리 중 서버에서 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}