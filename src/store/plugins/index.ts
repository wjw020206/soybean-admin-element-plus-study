import type { PiniaPluginContext } from 'pinia';
import { jsonClone } from '@sa/utils';
import { SetupStoreId } from '@/enum';

/** 该插件会重置由 setup 语法写入的商店状态
 * @param context
 */
export function resetSetupStore(context: PiniaPluginContext) {
  const setupSyntaxIds = Object.values(SetupStoreId) as string[];

  // 筛选出使用 setup 语法的 store
  if (setupSyntaxIds.includes(context.store.$id)) {
    const { $state } = context.store;

    // 在 store 初始化时，深拷贝一份初始状态
    const defaultStore = jsonClone($state);

    // 手动实现 $reset：用初始状态覆盖当前状态
    context.store.$reset = () => {
      context.store.$patch(defaultStore);
    };
  }
}
