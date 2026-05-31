import { generateChangelog, generateTotalChangelog } from '@soybeanjs/changelog';
import type { ChangelogOption } from '@soybeanjs/changelog';

/** 生成变更日志 */
export async function genChangelog(options: Partial<ChangelogOption>, total = false) {
  if (total) {
    await generateTotalChangelog(options);
  } else {
    await generateChangelog(options);
  }
}
