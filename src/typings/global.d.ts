export {};

declare global {
  export interface Window {
    /** 进度条实例 */
    NProgress?: import('nprogress').NProgress;
  }

  /** 项目构建的时间 */
  export const BUILD_TIME: string;
}
