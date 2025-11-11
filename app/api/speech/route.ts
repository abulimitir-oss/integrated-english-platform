import { NextRequest, NextResponse } from 'next/server'
import { analyzePronunciation } from '@/lib/ai/openai'

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

    const analysis = await analyzePronunciation(audio, text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Speech analysis error:', error)
    return NextResponse.json(
      { error: '발음 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}