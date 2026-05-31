import cac from 'cac';
import { blue, lightGreen } from 'kolorist';
import { version } from '../package.json';
import { loadCliOptions } from './config';
import type { Lang } from './locales';
import {
  cleanup,
  genChangelog,
  generateRoute,
  gitCommit,
  gitCommitVerify,
  printSoybean,
  release,
  updatePkg
} from './commands';

type Command =
  | 'cleanup'
  | 'update-pkg'
  | 'git-commit'
  | 'git-commit-verify'
  | 'changelog'
  | 'release'
  | 'gen-route'
  | 'print-soybean';

type CommandAction<A extends object> = (args?: A) => Promise<void> | void;

type CommandWithAction<A extends object = object> = Record<
  Command,
  {
    /** 命令描述 */
    desc: string;
    /** 命令执行的操作 */
    action: CommandAction<A>;
  }
>;

interface CommandArg {
  /** 在版本号升级后、git commit 之前执行额外命令，默认为 “pnpm sa changelog” */
  execute?: string;
  /** 指示是否推送 Git 提交和标签，默认为 true */
  push?: boolean;
  /** 按标签总数生成变更日志 */
  total?: boolean;
  /**
   * 要清理的目录的 glob 模式
   *
   * 如果未设置，则使用默认值
   *
   * 多个值之间用 “,” 分隔
   */
  cleanupDir?: string;
  /**
   * 命令行界面的显示语言
   *
   * @default 'en-us'
   */
  lang?: Lang;
}

/** 初始化终端命令 */
export async function setupCli() {
  // 加载终端选项
  const cliOptions = await loadCliOptions();

  const cli = cac(blue('soybean-admin'));

  cli
    .version(lightGreen(version))
    .option('-e, --execute [command]', "在版本号升级后、git commit 之前执行额外命令，默认为 'npx soy changelog'")
    .option('-p, --push', '指示是否推送 Git 提交和标签')
    .option('-t, --total', '按标签总数生成变更日志')
    .option('-c, --cleanupDir <dir>', '要清理的目录的 glob 模式，如果未设置，则使用默认值，多个值之间用 “,” 分隔')
    .option('-l, --lang <lang>', '命令行界面的显示语言', { default: 'en-us', type: [String] })
    .help();

  // 命令名称以及对应的方法
  const commands: CommandWithAction<CommandArg> = {
    cleanup: {
      desc: '删除目录：node_modules、dist 等',
      action: async () => {
        await cleanup(cliOptions.cleanupDirs);
      }
    },
    'update-pkg': {
      desc: '更新 package.json 依赖项版本',
      action: async () => {
        await updatePkg(cliOptions.ncuCommandArgs);
      }
    },
    'git-commit': {
      desc: 'git commit，生成符合常规提交标准的提交信息',
      action: async args => {
        await gitCommit(args?.lang);
      }
    },
    'git-commit-verify': {
      desc: '验证 Git 提交信息，确保其符合 Conventional Commits 标准',
      action: async args => {
        await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores);
      }
    },
    changelog: {
      desc: '生成变更日志',
      action: async args => {
        await genChangelog(cliOptions.changelogOptions, args?.total);
      }
    },
    release: {
      desc: '发布：更新版本、生成变更日志、提交代码',
      action: async args => {
        await release(args?.execute, args?.push);
      }
    },
    'gen-route': {
      desc: '生成路由',
      action: async () => {
        await generateRoute();
      }
    },
    'print-soybean': {
      desc: '打印 soybean',
      action: async () => {
        await printSoybean();
      }
    }
  };

  // 给 CLI 注册命令，并绑定这个命令执行时要调用的函数
  for (const [command, { desc, action }] of Object.entries(commands)) {
    cli.command(command, lightGreen(desc)).action(action);
  }

  // 开始解析命令行输入，并执行匹配到的命令
  cli.parse();
}

setupCli();
