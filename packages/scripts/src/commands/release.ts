import { versionBump } from 'bumpp';

/** 发布版本 */
export async function release(execute = 'pnpm sa changelog', push = true) {
  await versionBump({
    // 用于更新项目里匹配到的 package.json 版本号，但排除 node_modules 里的
    files: ['**/package.json', '!**/node_modules'],
    // 版本号改完后，执行额外命令
    execute,
    // 提交时会带上所有已修改文件
    all: true,
    // 给这次提交打 tag
    tag: true,
    // 把变更提交到 Git，%s 会被新版本号替换
    commit: 'chore(projects): release v%s',
    // 决定是否推送到远端
    push
  });
}
