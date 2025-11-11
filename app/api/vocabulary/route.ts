import { NextResponse } from 'next/server'
import { generateVocabularyList } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, payload } = body
    const aiProvider = process.env.AI_PROVIDER || 'openai'; // 检查环境变量

    switch (action) {
      // 我们将合并 'get-words-by-level' 和 'get-word-details'
      case 'get-vocabulary-list': {
        const { level, count = 5 } = payload
        if (!level) {
          return NextResponse.json({ error: 'Invalid or missing level' }, { status: 400 })
        }

        // 如果 AI 提供商是 gemini，则调用 Gemini API
        if (aiProvider === 'gemini') {
          const vocabularyList = await generateVocabularyList(level, count);
          return NextResponse.json(vocabularyList);
        } else {
          // 在这里可以保留或添加使用 OpenAI 或模拟数据的逻辑作为备用
          return NextResponse.json({ error: `AI provider '${aiProvider}' is not configured for vocabulary generation.` }, { status: 501 });
        }
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error('API Vocabulary Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  // 提供一个简单的GET端点用于测试API是否可达
  return NextResponse.json({ message: 'Vocabulary API is running. Use POST to fetch data.' })
}