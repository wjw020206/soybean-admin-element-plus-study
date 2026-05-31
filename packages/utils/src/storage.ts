/** 存储类型 */
export type StorageType = 'local' | 'session';

/** 创建持久化存储对象
 * @param type 存储类型
 * @param storagePrefix 持久化存储键的前缀
 */
export function createStorage<T extends object>(type: StorageType, storagePrefix: string) {
  const stg = type === 'session' ? window.sessionStorage : window.localStorage;

  const storage = {
    /**
     * 存储值
     * @param key 键名
     * @param value 值
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      const json = JSON.stringify(value);
      stg.setItem(`${storagePrefix}${key as string}`, json);
    },
    /**
     * 获取存储的值
     * @param key 键名
     */
    get<K extends keyof T>(key: K): T[K] | null {
      const json = stg.getItem(`${storagePrefix}${key as string}`);

      if (json) {
        let storageData: T[K] | null = null;

        try {
          storageData = JSON.parse(json);
        } catch {}

        if (storageData) {
          return storageData as T[K];
        }
      }

      stg.removeItem(`${storagePrefix}${key as string}`);

      return null;
    },
    /**
     * 移除存储的值
     * @param key 键名
     */
    remove(key: keyof T) {
      stg.removeItem(`${storagePrefix}${key as string}`);
    },
    /**
     * 清空所有的本地存储
     */
    clear() {
      stg.clear();
    }
  };

  return storage;
}
