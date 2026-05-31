import { execCommand } from '../shared';

/** 更新项目依赖版本 */
export async function updatePkg(args: string[] = ['--deep', '-u']) {
  await execCommand('npx', ['ncu', ...args], { stdio: 'inherit' });
}
