@echo off
chcp 65001 >nul
echo ========================================
echo  Integrated English Platform
echo ========================================
echo.

echo [1/3] Node.js 설치 확인...
node --version >nul 2>&1
if errorlevel 1 (
    echo 오류: Node.js가 감지되지 않았습니다
    echo https://nodejs.org/ 에서 Node.js를 다운로드하여 설치하세요
    pause
    exit /b 1
)
node --version

echo.
echo [2/3] 의존성 설치 중...
call npm install
if errorlevel 1 (
    echo 오류: 의존성 설치 실패
    pause
    exit /b 1
)

echo.
echo [3/3] 개발 서버 시작...
echo 접속 주소: http://localhost:3000
echo 서버 중지는 Ctrl+C
echo.
call npm run dev

