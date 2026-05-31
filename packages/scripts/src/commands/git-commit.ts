import path from 'node:path';
import { readFileSync } from 'node:fs';
import { prompt } from 'enquirer';
import { execCommand } from '../shared';
import { locales } from '../locales';
import type { Lang } from '../locales';

interface PromptObject {
  types: string;
  scopes: string;
  description: string;
}

/**
 * 使用常规提交标准进行 Git 提交
 *
 * @param lang
 */
export async function gitCommit(lang: Lang = 'en-us') {
  const { gitCommitMessages, gitCommitTypes, gitCommitScopes } = locales[lang];

  /** 类型选择 */
  const typesChoices = gitCommitTypes.map(([value, msg]) => {
    const nameWithSuffix = `${value}:`;

    const message = `${nameWithSuffix.padEnd(12)}${msg}`;

    return {
      name: value,
      message
    };
  });

  /** 作用域选择 */
  const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
    name: value,
    message: `${value.padEnd(30)} (${msg})`
  }));

  const result = await prompt<PromptObject>([
    {
      name: 'types',
      type: 'select',
      message: gitCommitMessages.types,
      choices: typesChoices
    },
    {
      name: 'scopes',
      type: 'select',
      message: gitCommitMessages.scopes,
      choices: scopesChoices
    },
    {
      name: 'description',
      type: 'text',
      message: gitCommitMessages.description
    }
  ]);

  const breaking = result.description.startsWith('!') ? '!' : '';

  const description = result.description.replace(/^!/, '').trim();

  // 拼接 git 提交信息
  const commitMsg = `${result.types}(${result.scopes})${breaking}: ${description}`;

  // 执行 git commit -m 命令，并将结果输出在当前终端中
  await execCommand('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
}

/** Git提交信息验证 */
export async function gitCommitVerify(lang: Lang = 'en-us', ignores: RegExp[] = []) {
  // 获取当前 Git 仓库的根目录绝对路径
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel']);

  // 拼接 Git 消息提交文件路径 gitPath + /.git/COMMIT_EDITMSG
  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  // 读取消息提交文件内容
  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  // 判断是否是需要忽略的提交文件内容
  if (ignores.some(regExp => regExp.test(commitMsg))) return;

  const REG_EXP = /(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

  // 判断 Git 消息是否满足 Conventional Commits 标准
  if (!REG_EXP.test(commitMsg)) {
    const errorMsg = locales[lang].gitCommitVerify;

    throw new Error(errorMsg);
  }
}
