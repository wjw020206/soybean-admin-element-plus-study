import { colorNames } from '../constant';
import { getHex, getHsl, getRgb } from './colord';

/**
 * 获取颜色的英文名称
 * 精确匹配时直接返回对应名称，否则通过 RGB + HSL 加权距离找到最相似的颜色名称
 * @param color 颜色值
 * @returns 颜色的英文名称
 */
export function getColorName(color: string) {
  // 将输入颜色转为 hex、RGB、HSL 三种格式，方便后续比较
  const hex = getHex(color);
  const rgb = getRgb(color);
  const hsl = getHsl(color);

  // 当前这次计算的综合差值
  let ndf = 0;
  // RGB 差异值（欧几里得距离的平方）
  let ndf1 = 0;
  // HSL 差异值（欧几里得距离的平方）
  let ndf2 = 0;
  // 最接近颜色在 colorNames 中的索引
  let cl = -1;
  // 当前找到的最小差值，-1 表示尚未计算
  let df = -1;
  // 最终返回的颜色名称
  let name = '';

  // 遍历预设颜色名称表，找到精确匹配或最相似的颜色
  colorNames.some((item, index) => {
    const [hexValue] = item;

    // 判断当前候选颜色是否与输入颜色完全匹配
    const match = hex === hexValue;

    if (match) {
      // 精确匹配，记录索引并终止遍历
      cl = index;
    } else {
      // 非精确匹配，计算与候选颜色的差异
      const { r, g, b } = getRgb(hexValue);
      const { h, s, l } = getHsl(hexValue);

      // 计算 RGB 空间的欧几里得距离平方：(R1-R2)² + (G1-G2)² + (B1-B2)²
      ndf1 = (rgb.r - r) ** 2 + (rgb.g - g) ** 2 + (rgb.b - b) ** 2;
      // 计算 HSL 空间的欧几里得距离平方：(H1-H2)² + (S1-S2)² + (L1-L2)²
      ndf2 = (hsl.h - h) ** 2 + (hsl.s - s) ** 2 + (hsl.l - l) ** 2;

      // 加权合并：RGB 差异 + 2 倍 HSL 差异
      // HSL 权重更高是因为它更符合人眼视觉感知
      ndf = ndf1 + ndf2 * 2;

      // 如果当前差值更小，更新最小差值和对应索引
      if (df < 0 || df > ndf) {
        df = ndf;
        cl = index;
      }
    }

    // 返回 true 终止遍历（精确匹配时），否则继续
    return match;
  });

  // 取出最匹配的颜色名称
  name = colorNames[cl][1];

  return name;
}
