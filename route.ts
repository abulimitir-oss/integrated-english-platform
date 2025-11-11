import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 在这里处理您的请求逻辑
    // 例如：const body = await request.json();
    console.log('API /api/pronunciation was called with POST method');

    // 返回成功响应
    return NextResponse.json({ message: 'Pronunciation processed successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 您也可以添加其他方法，例如 GET
export async function GET() {
  return NextResponse.json({ message: 'This is the pronunciation API' });
}