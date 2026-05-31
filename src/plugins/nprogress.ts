import NProgress from 'nprogress';

/** 安装 NProgress 进度条组件 */
export function setupNProgress() {
  NProgress.configure({
    easing: 'ease',
    speed: 500
  });

  // 将进度条组件挂载在 window 对象上
  window.NProgress = NProgress;
}
