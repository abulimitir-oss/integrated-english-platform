export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    // 이 줄은 V8 (Chrome, Node.js)에서 스택 추적을 올바르게 캡처하는 데 도움이 됩니다.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}