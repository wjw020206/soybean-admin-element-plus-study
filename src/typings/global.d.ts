export {};

declare global {
  export interface Window {
    /** 进度条实例 */
    NProgress?: import('nprogress').NProgress;
    /** 消息框实例 */
    $messageBox?: import('element-plus').IElMessageBox;
    /** 消息实例 */
    $message?: import('element-plus').Message;
    /** 通知实例 */
    $notification?: import('element-plus').Notify;
  }

  /** 项目构建的时间 */
  export const BUILD_TIME: string;
}
