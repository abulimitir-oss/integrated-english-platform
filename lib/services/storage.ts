/**
 * 一个简单的内存存储服务，用于在开发过程中模拟持久化存储。
 * 在浏览器环境中，可以轻松地切换到底层的 localStorage。
 */
class StorageService {
  private data: Map<string, any>;

  constructor() {
    this.data = new Map();
  }

  /**
   * 存储一个键值对。
   * @param key - 存储的键。
   * @param value - 要存储的值。
   */
  setItem(key: string, value: any): void {
    try {
      this.data.set(key, value);
    } catch (error) {
      console.error(`Error setting item with key "${key}":`, error);
    }
  }

  /**
   * 根据键获取一个值。
   * @param key - 要获取的键。
   * @returns 返回存储的值，如果不存在则返回 null。
   */
  getItem<T>(key: string): T | null {
    try {
      const item = this.data.get(key);
      return item !== undefined ? item : null;
    } catch (error) {
      console.error(`Error getting item with key "${key}":`, error);
      return null;
    }
  }

  /**
   * 根据键移除一个值。
   * @param key - 要移除的键。
   */
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

// 导出一个 StorageService 的单例，供其他服务使用。
export const storage = new StorageService();