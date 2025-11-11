
# """
# 文件名: gemini_test.py
# 功能: 测试 Google Gemini API 是否可用
# """

# import os
# import google.generativeai as genai

# # ================== 配置你的 API Key ==================
# # 方式1：直接写（不推荐，仅测试）
# # genai.configure(api_key="your-api-key-here")

# # 方式2：使用环境变量（推荐，安全）
# API_KEY = os.getenv("GEMINI_API_KEY")
# if not API_KEY:
#     print("错误：未找到 GEMINI_API_KEY 环境变量！")
#     print("请先设置：set GEMINI_API_KEY=your_real_key")
#     # exit(1)

# genai.configure(api_key='AIzaSyBsEeL1vk2HBXEV-sUWKEd6o3Ql0_4rsis')

# # ================== 选择模型 ==================
# # 可选模型：gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash-experimental 等
# MODEL_NAME = "gemini-2.0-flash"

# def test_gemini():
#     print(f"正在使用模型: {MODEL_NAME}")
#     print("发送请求中...")
#     print("-" * 50)

#     try:
#         # 创建模型实例
#         model = genai.GenerativeModel(MODEL_NAME)

#         # 发送请求
#         response = model.generate_content(
#             "用一句话解释人工智能是什么？",
#             generation_config={
#                 "temperature": 0.7,
#                 "max_output_tokens": 100,
#             }
#         )

#         # 打印结果
#         print("Gemini 回复：")
#         print(response.text)
#         print("-" * 50)
#         print("API 调用成功！")

#     except Exception as e:
#         print("API 调用失败！")
#         print(f"错误信息: {str(e)}")

#         if "API key not valid" in str(e):
#             print("原因：API Key 无效或未激活")
#         elif "quota" in str(e).lower():
#             print("原因：配额已用尽")
#         elif "403" in str(e):
#             print("原因：权限不足，检查 Key 是否启用 Gemini API")
#         else:
#             print("其他错误，请检查网络或 Key")

# if __name__ == "__main__":
#     test_gemini()


# import os
# from google.cloud import speech

# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'speech-to-text-project-477812-fd87093388d8.json'

# client = speech.SpeechClient()
# audio = speech.RecognitionAudio('123.mp3')  # 或本地文件
# config = speech.RecognitionConfig(encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16, sample_rate_hertz=16000, language_code='zh-CN')
# response = client.recognize(config=config, audio=audio)
# for result in response.results:
#     print(result.alternatives[0].transcript)


# 文件名: test_local_mp3.py
from google.cloud import speech
import io
import os

# --- 推荐的修改：使用绝对路径 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(BASE_DIR, 'speech-to-text-project-477812-fd87093388d8.json')
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = CREDENTIALS_PATH


def transcribe_local_mp3(file_path):
    """转录本地 MP3 文件（≤1 分钟）"""
    client = speech.SpeechClient()

    # 读取本地文件
    with io.open(file_path, "rb") as audio_file:
        content = audio_file.read()

    # 配置
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=44100,        # 常见 MP3 采样率
        language_code="zh-CN",          # 改成你的语言：en-US, zh-CN, ja-JP 等
        audio_channel_count=2           # 立体声；单声道改成 1
    )

    # 使用 long_running_recognize（支持 content）
    print("正在转录，请稍等...")
    operation = client.long_running_recognize(config=config, audio=audio)
    response = operation.result(timeout=90)  # 最多等 90 秒

    # 输出结果
    print("\n=== 转录结果 ===")
    for result in response.results:
        print(f"文本: {result.alternatives[0].transcript}")
        print(f"置信度: {result.alternatives[0].confidence:.2%}")

# === 执行测试 ===
if __name__ == "__main__":
    mp3_path = "123.mp3"  # 确保和脚本在同一目录，或写绝对路径
    transcribe_local_mp3(mp3_path)