# 🚀 빠른 시작 가이드

## 📋 프로젝트 개요

이 프로젝트는 7가지 핵심 영어 학습 기능을 통합한 애플리케이션입니다. 포함된 주요 기능:

1. **글쓰기 모듈** - AI 문법 교정, 작문 채점, 문장 다듬기
2. **대화 모듈** - 다수의 상황별 대화, 음성 입력, 발음 교정
3. **읽기 모듈** - TOEIC/TOEFL/SAT 독해 연습
4. **말하기 모듈** - 녹음 연습, 발음 분석
5. **어휘 모듈** - 간격 반복 학습, CEFR 기반 어휘
6. **평가 모듈** - CEFR 레벨 테스트, 학습 분석
7. **게임화 모듈** - XP 시스템, 과제 시스템, 3D 환경
8. **커뮤니티 모듈** - 학습 후기, Q&A, 리더보드

## 🛠️ 설치 단계

### 1. 의존성 설치

```bash
cd integrated-english-platform
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here  # 선택 사항
NEXT_PUBLIC_APP_NAME=Integrated English Platform
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 📁 프로젝트 구조 (요약)

```
integrated-english-platform/
├── app/               # Next.js App Router
├── components/        # React 컴포넌트
├── contexts/          # React Context
├── lib/               # 유틸리티
└── types/             # 타입 정의
```

## 🎯 기능 모듈

### 1. 글쓰기 모듈 (`/writing`)
- 실시간 문법 교정
- 작문 채점
- 문장 다듬기
- 일일 문장 기능

### 2. 대화 모듈 (`/conversation`)
- 상황 선택 및 실시간 AI 대화
- 음성 입력
- 발음 교정

### 3. 읽기 모듈 (`/reading`)
- 시험형 독해 연습
- 시간 관리 및 즉시 채점

### 4. 말하기 모듈 (`/speaking`)
- 녹음 연습
- 발음 분석
- AI와의 구두 대화

### 5. 어휘 모듈 (`/vocabulary`)
- 간격 반복 학습
- CEFR 레벨 기반 어휘
- 어휘 테스트

### 6. 레벨 테스트 (`/level-test`)
- CEFR A1~C2 테스트
- 학습 분석 및 피드백

### 7. 메타버스 (`/metaverse`)
- 3D 환경
- NPC 대화
- 과제 시스템

### 8. 커뮤니티 (`/community`)
- 학습 후기
- Q&A 및 토론
- 리더보드

## 🔧 개발 가이드

### 새 모듈 추가

1. `app/` 내에 새 페이지 생성
2. `components/`에 컴포넌트 추가
3. 필요 시 `app/api/`에 API 라우트 추가
4. 내비게이션에 링크 추가

### AI 기능 사용 예

```typescript
import { correctGrammar, generateConversation } from '@/lib/ai/openai'

// 문법 교정
const result = await correctGrammar(text)

// 대화 생성
const response = await generateConversation(scenario, message, history)
```

### 데이터 저장 예

```typescript
import { storage } from '@/lib/storage'

// 학습 진행 저장
storage.setProgress({ streak: 5, lastDate: '2025-01-26', totalDays: 10 })

// 학습 진행 불러오기
const progress = storage.getProgress()
```

## 📝 다음 단계

1. API 키 구성
2. 개발 서버 실행
3. 각 모듈 기능 테스트
4. 필요에 따라 기능 커스터마이징

## 🐛 문제 해결

### API 키 문제
- `.env.local` 파일 확인
- API 키 형식 확인
- 서버 재시작

### 빌드 오류
- `npm install` 재실행
- `.next` 디렉터리 삭제
- TypeScript 오류 확인

## 📚 추가 자료

`README.md` 및 `INTEGRATION_PLAN.md` 참고

