import { createStorage } from '@sa/utils';

/** 存储键前缀 */
const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || '';

export const localStg = createStorage<StorageType.Local>('local', storagePrefix);
