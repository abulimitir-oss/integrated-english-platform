# 🚀 프로젝트 실행 가이드

## 방법1: 명령줄 사용

### 1. 터미널/명령 프롬프트 열기
- Windows: `Win + R` → `cmd` 또는 `powershell` 입력
- Mac/Linux: Terminal 실행

### 2. 프로젝트 디렉터리로 이동
```bash
cd "C:\Users\热那克孜420\Downloads\7\integrated-english-platform"
```

경로에 한글(또는 공백)이 포함되어 문제가 발생하면:
- 경로 전체를 큰따옴표로 감싸세요
- 또는 상대 경로를 사용하세요

### 3. 의존성 설치
```bash
npm install
```

### 4. 환경 변수 설정 (선택)
`.env.local` 파일 생성:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. 개발 서버 실행
```bash
npm run dev
```

### 6. 애플리케이션 접속
브라우저에서 http://localhost:3000 을 엽니다

---

## 방법2: VS Code 사용

### 1. VS Code에서 프로젝트 열기
- VS Code 실행
- File → Open Folder → `integrated-english-platform` 선택

### 2. 터미널 열기
- Windows: `Ctrl + ~`  또는 Terminal → New Terminal

### 3. 명령 실행
```bash
npm install
npm run dev
```

---

## 방법3: 파일 탐색기에서 실행

### 1. 프로젝트 폴더에서 터미널 열기
- `integrated-english-platform` 폴더로 이동
- 주소 표시줄에 `cmd` 입력 후 Enter (Windows)

### 2. 명령 실행
```bash
npm install
npm run dev
```

---

## 자주 묻는 질문

### Q: `npm install`이 실패합니다
**A:** Node.js가 설치되어 있는지 확인하세요
- `node --version` 실행
- 설치되어 있지 않다면 https://nodejs.org/ 에서 설치하세요

### Q: 포트 3000이 이미 사용 중입니다
**A:** 다른 포트로 실행하세요
```bash
npm run dev -- -p 3001
```

### Q: 경로에 한글이 포함되어 문제가 발생합니다
**A:**
1. 프로젝트를 한글이 없는 경로로 이동
2. 또는 경로를 큰따옴표로 감싸기

### Q: 의존성 설치가 느립니다
**A:** 미러 레지스트리 사용
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 자주 쓰는 명령

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start

# 린트 검사
npm run lint
```

---

## 다음 단계

애플리케이션 실행 후 다음을 시도하세요:
1. http://localhost:3000 에 접속하여 홈 확인
2. 각 모듈 기능 테스트
3. 필요 시 API 키 구성
4. 새 기능 개발 시작

---

**팁**: 문제가 발생하면 다음을 확인하세요:
- Node.js 버전 (권장 v18+)
- npm 버전
- 네트워크 연결
- 포트 사용 여부

