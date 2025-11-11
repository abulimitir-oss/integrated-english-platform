import { NextRequest, NextResponse } from 'next/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'en-US-JennyNeural' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: '텍스트를 제공해주세요.' },
        { status: 400 }
      );
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      return NextResponse.json(
        { error: 'Azure Speech 서비스가 구성되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 创建语音配置
    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechSynthesisVoiceName = voice;

    // 创建音频配置
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

    // 创建语音合成器
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    // 合成语音
    const result = await new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        result => {
          synthesizer.close();
          resolve(result);
        },
        error => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: '음성 변환 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}