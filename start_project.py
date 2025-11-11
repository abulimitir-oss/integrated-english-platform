#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import subprocess
import platform
import webbrowser

def print_header():
    print("="*40)
    print(" Integrated English Platform Launcher")
    print("="*40)
    print()


def check_node():
    """Node.js가 설치되어 있는지 확인"""
    try:
        node_version = subprocess.check_output(['node', '--version'], stderr=subprocess.STDOUT).decode().strip()
        print(f"✓ Node.js가 설치되어 있습니다: {node_version}")
        return True
    except:
        print("✗ Node.js가 설치되어 있지 않습니다")
        print("https://nodejs.org/ 에서 Node.js를 다운로드하여 설치해 주세요")
        return False

def run_command_with_realtime_output(command, shell=True, env=None):
    """명령을 실행하고 출력 실시간으로 표시"""
    try:
        my_env = os.environ.copy()
        if env:
            my_env.update(env)
        
        process = subprocess.Popen(
            command,
            shell=shell,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8', # 명시적으로 UTF-8 사용
            errors='replace', # 인코딩 오류 발생 시 대체 문자로 처리
            env=my_env,
            bufsize=1 # 라인 버퍼링
        )
        
        for line in iter(process.stdout.readline, ''):
            print(line.strip())
        
        process.wait()
        return process.returncode == 0
    except Exception as e:
        print(f"명령 실행 중 오류 발생: {e}")
        return False

def install_dependencies():
    """프로젝트 의존성 설치"""
    print("\n[1/3] 프로젝트 의존성 설치 중...")
    return run_command_with_realtime_output('npm install && npm install lucide-react @google/generative-ai')

def start_dev_server():
    """개발 서버 시작"""
    print("\n[2/3] 개발 서버 시작 중...")
    # npm/Next.js가 자동으로 .env.local 파일을 읽으므로 Python에서 별도로 읽을 필요가 없습니다.
    # npm run dev 프로세스는 올바른 환경 변수를 상속받게 됩니다.
    return run_command_with_realtime_output('npm run dev')


def main():
    # 기본 인코딩을 UTF-8로 설정 (스크립트 시작 부분)
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
    if sys.stderr.encoding != 'utf-8':
        sys.stderr.reconfigure(encoding='utf-8')

    # 스크립트가 위치한 디렉터리 가져오기
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # 프로젝트 디렉터리로 이동
    os.chdir(script_dir)
    print(f"작업 디렉터리: {os.getcwd()}")
    
    print_header()
    
    # Node.js 확인
    if not check_node():
        input("\nPress Enter to continue...")
        sys.exit(1)
    
    # 의존성 설치
    if not install_dependencies():
        print("\n❌ 의존성 설치 실패")
        input("Press Enter to continue...")
        sys.exit(1)
    
    # 서버 시작
    print("\n[3/3] 프로젝트 시작 중... (이 과정은 몇 분 정도 소요될 수 있습니다)")
    print("참고: 서버가 시작되면 http://localhost:3000 또는 http://localhost:3001 를 방문하세요")
    print("서버를 중지하려면 Ctrl+C 를 누르세요\n")
    
    # 개발 서버 시작
    start_dev_server()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n서버가 중지되었습니다")
        sys.exit(0)