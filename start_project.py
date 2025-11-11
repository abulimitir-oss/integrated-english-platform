# #!/usr/bin/env python3

# # -*- coding: utf-8 -*-
# import os
# import sys
# import subprocess
# import platform
# import webbrowser

# def print_header():
#     print("="*40)
#     print(" Integrated English Platform Launcher")
#     print("="*40)
#     print()


# def check_node():
#     """Node.js가 설치되어 있는지 확인"""
#     try:
#         node_version = subprocess.check_output(['node', '--version'], stderr=subprocess.STDOUT).decode().strip()
#         print(f"✓ Node.js가 설치되어 있습니다: {node_version}")
#         return True
#     except:
#         print("✗ Node.js가 설치되어 있지 않습니다")
#         print("https://nodejs.org/ 에서 Node.js를 다운로드하여 설치해 주세요")
#         return False

# def run_command_with_realtime_output(command, shell=True, env=None):
#     """명령을 실행하고 출력 실시간으로 표시"""
#     try:
#         my_env = os.environ.copy()
#         if env:
#             my_env.update(env)
        
#         process = subprocess.Popen(
#             command,
#             shell=shell,
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE,
#             text=True,
#             encoding='utf-8', # 명시적으로 UTF-8 사용
#             errors='replace', # 인코딩 오류 발생 시 대체 문자로 처리
#             env=my_env,
#             bufsize=1 # 라인 버퍼링
#         )
        
#         for line in iter(process.stdout.readline, ''):
#             print(line.strip())
        
#         process.wait()
#         return process.returncode == 0
#     except Exception as e:
#         print(f"명령 실행 중 오류 발생: {e}")
#         return False

# def install_dependencies():
#     """프로젝트 의존성 설치"""
#     print("\n[1/3] 프로젝트 의존성 설치 중...")
#     return run_command_with_realtime_output('npm install && npm install lucide-react @google/generative-ai')

# def build_project():
#     """프로젝트 빌드"""
#     print("\n[2/4] 프로젝트 빌드 중...")
#     # Next.js 프로젝트를 프로덕션용으로 빌드합니다.
#     return run_command_with_realtime_output('npm run build')

# def start_production_server():
#     """프로덕션 서버 시작"""
#     print("\n[3/4] 프로덕션 서버 시작 중...")
#     # npm/Next.js가 자동으로 .env.local 파일을 읽으므로 Python에서 별도로 읽을 필요가 없습니다.
#     # Render와 같은 배포 환경에서는 $PORT 환경 변수를 자동으로 제공합니다.
#     # package.json의 'start' 스크립트가 이미 $PORT를 사용하도록 설정되어 있습니다.
#     return run_command_with_realtime_output('npm run start')



# def main():
#     # 스크립트가 위치한 디렉터리 가져오기
#     script_dir = os.path.dirname(os.path.abspath(__file__))

#     # 프로젝트 디렉터리로 이동
#     os.chdir(script_dir)
#     print(f"작업 디렉터리: {os.getcwd()}")

#     print_header()
#     # 기본 인코딩을 UTF-8로 설정 (스크립트 시작 부분)
#     if sys.stdout.encoding != 'utf-8':
#         sys.stdout.reconfigure(encoding='utf-8')
#     if sys.stderr.encoding != 'utf-8':
#         sys.stderr.reconfigure(encoding='utf-8')

#     # 스크립트가 위치한 디렉터리 가져오기
    
#     # Node.js 확인
#     if not check_node():
#         input("\nPress Enter to continue...")
#         sys.exit(1)
    
#     # 의존성 설치
#     if not install_dependencies():
#         print("\n❌ 의존성 설치 실패")
#         input("Press Enter to continue...")
#         sys.exit(1)
    
#     # 프로젝트 빌드
#     if not build_project():
#         print("\n❌ 프로젝트 빌드 실패")
#         input("Press Enter to continue...")
#         sys.exit(1)

#     # 프로덕션 서버 시작
#     print("\n[4/4] 프로젝트 시작 중... (이 과정은 몇 분 정도 소요될 수 있습니다)")
#     print("참고: 서버가 시작되면 http://localhost:3000 또는 http://localhost:3001 를 방문하세요")
#     print("서버를 중지하려면 Ctrl+C 를 누르세요\n")
    
#     # 프로덕션 서버 시작
#     start_production_server()

# if __name__ == "__main__":
#     try:
#         main()
#     except KeyboardInterrupt:
#         print("\n\n서버가 중지되었습니다")
#         sys.exit(0)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import subprocess
import platform
import webbrowser

# -------------------------------------------------
# 1. 统一的实时输出函数（兼容 Windows/macOS/Linux）
# -------------------------------------------------
def run_command_with_realtime_output(command, cwd=None, env=None):
    """执行命令并实时打印 stdout + stderr"""
    my_env = os.environ.copy()
    if env:
        my_env.update(env)

    # Windows 上不需要 shell=True，Linux/macOS 需要
    shell = platform.system() == "Windows"

    process = subprocess.Popen(
        command,
        cwd=cwd,
        env=my_env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,      # 把错误也打印到 stdout
        text=True,
        encoding='utf-8',
        errors='replace',
        bufsize=1,
    )

    for line in process.stdout:
        print(line.rstrip())

    process.wait()
    return process.returncode == 0


# -------------------------------------------------
# 2. 检查 Node.js
# -------------------------------------------------
def check_node():
    try:
        ver = subprocess.check_output(['node', '--version'], stderr=subprocess.DEVNULL).decode().strip()
        print(f"Node.js 已安装: {ver}")
        return True
    except Exception:
        print("Node.js 未检测到，请先安装 https://nodejs.org/")
        return False


# -------------------------------------------------
# 3. 依赖、构建、生产启动（顺序不变）
# -------------------------------------------------
def install_dependencies():
    print("\n[1/3] 正在安装 npm 依赖...")
    return run_command_with_realtime_output(['npm', 'ci'], cwd=os.getcwd())

def build_project():
    print("\n[2/3] 正在构建生产包...")
    return run_command_with_realtime_output(['npm', 'run', 'build'], cwd=os.getcwd())

def start_production_server():
    print("\n[3/3] 启动生产服务器...")
    # Render 会提供 $PORT，package.json 的 start 脚本已经使用它
    return run_command_with_realtime_output(['npm', 'run', 'start'], cwd=os.getcwd())


# -------------------------------------------------
# 4. 主入口
# -------------------------------------------------
def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"工作目录: {os.getcwd()}\n")

    # ---- 统一 UTF-8 输出 ----
    if sys.stdout.encoding.lower() != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
    if sys.stderr.encoding.lower() != 'utf-8':
        sys.stderr.reconfigure(encoding='utf-8')

    # ---- 步骤执行 ----
    if not check_node():
        sys.exit(1)

    if not install_dependencies():
        print("\n依赖安装失败")
        sys.exit(1)

    if not build_project():
        print("\n构建失败")
        sys.exit(1)

    # 启动服务器（Render 环境会一直运行，不会退出）
    start_production_server()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n手动停止")
        sys.exit(0)