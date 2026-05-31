import process from 'node:process';
import path from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { prompt } from 'enquirer';
import { green, red } from 'kolorist';

interface PromptObject {
  routeName: string;
  addRouteParams: boolean;
  routeParams: string;
}

/** 生成路由 */
export async function generateRoute() {
  const result = await prompt<PromptObject>([
    {
      name: 'routeName',
      type: 'text',
      message: '请输入路由名称',
      initial: 'demo-route_child'
    },
    {
      name: 'addRouteParams',
      type: 'confirm',
      message: '是否要添加路由参数?',
      initial: false
    }
  ]);

  // 判断是否要添加路由参数
  if (result.addRouteParams) {
    const answers = await prompt<PromptObject>([
      {
        name: 'routeParams',
        type: 'text',
        message: '请输入路由参数',
        initial: 'id'
      }
    ]);

    Object.assign(result, answers);
  }

  const PAGE_DIR_NAME_PATTERN = /^[\w-]+[0-9a-zA-Z]+$/;

  // 校验用户输入的 routeName 是否是=合法
  if (!PAGE_DIR_NAME_PATTERN.test(result.routeName)) {
    throw new Error(`${red('路线名称无效，只允许使用字母、数字、“-”或“_”')}.
例如:
(1) 一级路由: ${green('demo-route')}
(2) 二级路由: ${green('demo-route_child')}
(3) 多级路由: ${green('demo-route_child_child')}
(4) 路由分组: ${green('_ignore_demo-route')}'
`);
  }

  const PARAM_REG = /^\w+$/g;

  // 校验用户输入的 routeParams 是否合法
  if (result.routeParams && !PARAM_REG.test(result.routeParams)) {
    throw new Error(red('路由参数无效，只允许字母、数字或“_”'));
  }

  // 获取当前 Node.js 进程运行时的工作目录
  const cwd = process.cwd();

  const [dir, ...rest] = result.routeName.split('_') as string[];

  let routeDir = path.join(cwd, 'src', 'views', dir);

  if (rest.length) {
    routeDir = path.join(routeDir, rest.join('_'));
  }

  // 判断目录是否存在
  if (existsSync(routeDir)) {
    // 创建目录，如果父目录不存在，就一层一层帮你创建
    mkdirSync(routeDir, { recursive: true });
  } else {
    throw new Error(red('路由已经存在'));
  }

  const fileName = result.routeParams ? `[${result.routeParams}].vue` : 'index.vue';

  const vueTemplate = `<script setup lang="ts"></script>

<template>
  <div>${result.routeName}</div>
</template>

<style scoped></style>
`;

  const filePath = path.join(routeDir, fileName);

  // 将模版内容写入 .vue 文件中
  await writeFile(filePath, vueTemplate);
}
