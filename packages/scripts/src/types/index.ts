import type { ChangelogOption } from '@soybeanjs/changelog';

export interface CliOption {
  /** 项目根目录 */
  cwd: string;
  /**
   * 清理目录
   *
   * 全局模式语法 {@link https://github.com/isaacs/minimatch}
   *
   * @default
   * ```json
   * ["** /dist", "** /pnpm-lock.yaml", "** /node_modules", "!node_modules/**"]
   * ```
   */
  cleanupDirs: string[];
  /** npm-check-updates 命令参数
   *
   * @default ['--deep', '-u']
   */
  ncuCommandArgs: string[];
  /**
   * 生成变更日志的选项
   *
   * @link https://github.com/soybeanjs/changelog
   */
  changelogOptions: Partial<ChangelogOption>;
  /** git commit verify 的忽略模式列表 */
  gitCommitVerifyIgnores: RegExp[];
}
