import { NextResponse } from 'next/server'
import { generateVocabularyList } from '@/lib/ai/gemini';

// --- 本地备用数据 ---
const fallbackVocabulary = {
  A1: [
    { word: 'hello', meaning: '안녕하세요', example: 'You say hello, I say goodbye.' },
    { word: 'book', meaning: '책', example: 'I am reading a very interesting book.' },
    { word: 'water', meaning: '물', example: 'Please drink plenty of water.' },
    { word: 'apple', meaning: '사과', example: 'An apple a day keeps the doctor away.' },
    { word: 'house', meaning: '집', example: 'My house is in the city center.' },
  ],
  B2: [
    { word: 'articulate', meaning: '분명히 표현하다', example: 'She is a highly articulate speaker.' },
    { word: 'comprehensive', meaning: '종합적인', example: 'He has a comprehensive knowledge of the subject.' },
    { word: 'elaborate', meaning: '상세히 설명하다', example: 'Could you elaborate on that point?' },
    { word: 'feasible', meaning: '실행 가능한', example: 'We need to find a feasible solution to this problem.' },
    { word: 'meticulous', meaning: '꼼꼼한', example: 'He was meticulous in his work.' },
  ],
  // 您可以为其他等级添加更多备用数据
};

function getFallbackData(level: string, count: number) {
  const levelKey = level.toUpperCase() as keyof typeof fallbackVocabulary;
  const data = fallbackVocabulary[levelKey] || fallbackVocabulary.A1; // 如果等级不存在，则默认返回 A1
  return data.slice(0, count);
}

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
        let vocabularyList;
        if (aiProvider === 'gemini') {
          try {
            vocabularyList = await generateVocabularyList(level, count);
          } catch (geminiError) {
            console.warn('Gemini API call failed for vocabulary, using fallback data. Reason:', geminiError);
            vocabularyList = getFallbackData(level, count);
          }
        } else {
          // 如果 AI_PROVIDER 不是 'gemini' (例如 'openai' 或未设置)，则直接使用备用数据
          console.warn(`AI provider '${aiProvider}' is not configured for vocabulary generation. Using fallback data.`);
          vocabularyList = getFallbackData(level, count);
        }
        return NextResponse.json(vocabularyList);
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