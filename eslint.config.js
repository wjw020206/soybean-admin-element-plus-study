import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  { vue: true, unocss: true },
  {
    rules: {
      // 配置 Vue 组件必须多单词命名
      'vue/multi-word-component-names': [
        'warn', // 警告级别，不报错
        {
          // 以下文件名忽略 ESLint 警告
          ignores: ['index', 'App', 'Register', '[id]', '[url]']
        }
      ],
      // 配置模板中使用组件命名风格
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase', // 推荐使用大驼峰
        {
          registeredComponentsOnly: false, // 不只限制已注册组件，所有组件都检查
          ignores: ['/^icon-/'] // 忽略所有 icon 开头组件
        }
      ]
    }
  }
);
