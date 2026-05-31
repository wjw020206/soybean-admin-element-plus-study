import { URL, fileURLToPath } from 'node:url';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy, getBuildTime } from './build/config';

/** https://vite.dev/config/ */
export default defineConfig(configEnv => {
  /** 加载环境变量 */
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  /** 构建时间 */
  const buildTime = getBuildTime();

  /** 是否启用代理（开发模式并且不是预览模式） */
  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview;

  return {
    base: viteEnv.VITE_BASE_URL,
    /** 定义路径别名 */
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      /** CSS 预处理配置 */
      preprocessorOptions: {
        scss: {
          /** 使用 现代的 Sass 编译接口 */
          api: 'modern-compiler',
          /** 在每一个 .scss 文件顶部都添加 `@use "@/styles/scss/global.scss as *;` */
          additionalData: `@use "@/styles/scss/global.scss as *;"`
        }
      }
    },
    /** 安装 Vite 插件 */
    plugins: setupVitePlugins(viteEnv, buildTime),
    /** 编译时全局常量 */
    define: {
      /** 构建时间 */
      BUILD_TIME: JSON.stringify(buildTime)
    },
    /** 配置开发服务器 */
    server: {
      host: '0.0.0.0',
      port: 9528,
      open: true,
      proxy: createViteProxy(viteEnv, enableProxy)
    },
    preview: {
      /** 配置预览端口 */
      port: 9529
    },
    /** 构建配置 */
    build: {
      /** 禁用 gzip 压缩大小报告 */
      reportCompressedSize: false,
      /** 是否生成 source map 文件 */
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      commonjsOptions: {
        /** CommonJS 转换时需要处理 try...catch 里的 require */
        ignoreTryCatch: false
      }
    }
  };
});
