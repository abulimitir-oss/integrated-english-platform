import { NextRequest, NextResponse } from 'next/server'
import { analyzePronunciationWithGoogle } from '@/lib/ai/gemini' // 导入新的 Google 函数

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audio = formData.get('audio') as Blob
    const text = formData.get('text') as string

    // 验证请求参数
    if (!audio) {
      return NextResponse.json(
        { error: '음성 파일이 없습니다.' },
        { status: 400 }
      )
    }
    
    if (!text) {
      return NextResponse.json(
        { error: '비교할 텍스트가 없습니다.' },
        { status: 400 }
      )
    }

    // 验证文件大小和类型
    if (audio.size === 0) {
      return NextResponse.json(
        { error: '빈 음성 파일입니다.' },
        { status: 400 }
      )
    }

    if (audio.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: '음성 파일이 너무 큽니다. (최대 25MB)' },
        { status: 400 }
      )
    }

    const analysis = await analyzePronunciationWithGoogle(audio, text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Speech analysis error:', error)
    // 将捕获到的原始错误信息返回给客户端，而不是一个通用消息
    const errorMessage = error instanceof Error ? error.message : '발음 분석 중 알 수 없는 오류가 발생했습니다.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}