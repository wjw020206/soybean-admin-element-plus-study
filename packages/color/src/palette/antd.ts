import type { AnyColor, HsvColor } from 'colord';
import type { ColorIndex } from '../types';
import { getHex, getHsv, isValidColor, mixColor } from '../shared';

/** 色调步调，每档色相偏移量 */
const hueStep = 2;
/** 饱和度步调，浅色部分每档递减量 */
const saturationStep = 16;
/** 饱和度步调，深色部分每档递增量 */
const saturationStep2 = 5;
/** 亮度阶梯，浅色部分每档递增量 */
const brightnessStep1 = 5;
/** 亮度阶梯，深色部分每档递减量 */
const brightnessStep2 = 15;
/** 浅色计数，主色向上共 5 档（1~5） */
const lightColorCount = 5;
/** 深色计数，主色向下共 4 档（7~10） */
const darkColorCount = 4;

/**
 * 通过索引获取 AntD 颜色系列中的颜色
 *
 * @param color - 颜色
 * @param index - 颜色在颜色系列中的索引（主颜色索引为 6）
 * @returns 十六进制颜色值
 */
function getAntDPaletteColorByIndex(color: AnyColor, index: ColorIndex): string {
  if (!isValidColor(color)) {
    throw new Error('invalid input color value');
  }

  //  如果 index === 6，直接返回主色的 hex 值
  if (index === 6) {
    return getHex(color);
  }

  // 如果 index < 6，表示浅色方向（向上偏移），index > 6 表示深色方向（向下偏移）
  const isLight = index < 6;
  const hsv = getHsv(color);
  // 通过 HSV 色彩空间计算偏移量 i，用于后续调整色相/饱和度/明度来生成色阶
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;

  // 分别计算新的色相、饱和度、明度，组合成新的 HSV 颜色
  const newHsv: HsvColor = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight)
  };

  // 将 HSV 转为 hex 返回
  return getHex(newHsv);
}

/** 深色主题下，色阶索引与不透明度的映射关系 */
const darkColorMap = [
  { index: 7, opacity: 0.15 }, // 1号色：取 7 号色阶混合 15% 不透明度
  { index: 6, opacity: 0.25 }, // 2号色：取主色混合 25% 不透明度
  { index: 5, opacity: 0.3 }, // 3号色：取 5 号色阶混合 30% 不透明度
  { index: 5, opacity: 0.45 }, // 4号色：取 5 号色阶混合 45% 不透明度
  { index: 5, opacity: 0.65 }, // 5号色：取 5 号色阶混合 65% 不透明度
  { index: 5, opacity: 0.85 }, // 6号色：取 5 号色阶混合 85% 不透明度
  { index: 5, opacity: 0.9 }, // 7号色：取 5 号色阶混合 90% 不透明度
  { index: 4, opacity: 0.93 }, // 8号色：取 4 号色阶混合 93% 不透明度
  { index: 3, opacity: 0.95 }, // 9号色：取 3 号色阶混合 95% 不透明度
  { index: 2, opacity: 0.97 }, // 10号色：取 2 号色阶混合 97% 不透明度
  { index: 1, opacity: 0.98 } // 11号色：取 1 号色阶混合 98% 不透明度
];

/**
 * 获取 AntD 风格的颜色系列
 *
 * @param color 颜色
 * @param darkTheme 深色主题
 * @param darkThemeMixColor 深色主题混合颜色（默认值：#141414）
 */
export function getAntDColorPalette(color: AnyColor, darkTheme = false, darkThemeMixColor = '#141414'): string[] {
  // AntD 色板共 11 个色阶，索引 1~11，其中 6 为主色
  const indexes: ColorIndex[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // 为每个索引生成对应的色阶颜色
  const patterns = indexes.map(index => getAntDPaletteColorByIndex(color, index));

  // 深色主题：将色阶颜色与深色背景混合，生成深色主题专用色板
  if (darkTheme) {
    const darkPatterns = darkColorMap.map(({ index, opacity }) => {
      // 按指定比例将深色背景色与色阶颜色混合
      const darkColor = mixColor(darkThemeMixColor, patterns[index], opacity);

      return darkColor;
    });

    // 将混合后的颜色转为 hex 格式返回
    return darkPatterns.map(item => getHex(item));
  }

  // 浅色主题：直接返回生成的色阶
  return patterns;
}

/**
 * 获取色调
 *
 * @param hsv HSV 颜色格式
 * @param i 与主色（6号）的相对偏移量
 * @param isLight 是否为浅色方向
 */
function getHue(hsv: HsvColor, i: number, isLight: boolean) {
  let hue: number;

  // 取整避免浮点数精度问题
  const hsvH = Math.round(hsv.h);

  // 冷色区（黄→绿→蓝，60°~240°）：浅色往暖偏，深色往冷偏；暖色区则相反
  if (hsvH >= 60 && hsvH <= 240) {
    hue = isLight ? hsvH - hueStep * i : hsvH + hueStep * i;
  } else {
    hue = isLight ? hsvH + hueStep * i : hsvH - hueStep * i;
  }

  // 色相是 0°~360° 的环形空间，处理下溢
  if (hue < 0) {
    hue += 360;
  }

  // 处理上溢
  if (hue >= 360) {
    hue -= 360;
  }

  return hue;
}

/**
 * 获取饱和度
 * 浅色方向：饱和度递减，让浅色更柔和
 * 深色方向：饱和度递增，让深色更浓郁
 *
 * @param hsv HSV 颜色格式
 * @param i 与主色（6号）的相对偏移量
 * @param isLight 是否为浅色方向
 */
function getSaturation(hsv: HsvColor, i: number, isLight: boolean) {
  // 灰色（色相为 0 且饱和度为 0）不做调整，直接返回
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }

  let saturation: number;

  if (isLight) {
    // 浅色：每档递减 saturationStep
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    // 最深色（10号）：额外加一次 saturationStep 补偿
    saturation = hsv.s + saturationStep;
  } else {
    // 其他深色：每档递增 saturationStep2
    saturation = hsv.s + saturationStep2 * i;
  }

  // 饱和度上限 100
  if (saturation > 100) {
    saturation = 100;
  }

  // 最浅色（1号）饱和度不超过 10，保证接近白色
  if (isLight && i === lightColorCount && saturation > 10) {
    saturation = 10;
  }

  // 饱和度下限 6，避免完全无色彩
  if (saturation < 6) {
    saturation = 6;
  }

  return saturation;
}

/**
 * 获取明度（Value）
 * 浅色方向：明度递增，颜色变亮
 * 深色方向：明度递减，颜色变暗
 *
 * @param hsv HSV 颜色格式
 * @param i 与主色（6号）的相对偏移量
 * @param isLight 是否为浅色方向
 */
function getValue(hsv: HsvColor, i: number, isLight: boolean) {
  let value: number;

  if (isLight) {
    // 浅色：每档递增 brightnessStep1
    value = hsv.v + brightnessStep1 * i;
  } else {
    // 深色：每档递减 brightnessStep2
    value = hsv.v - brightnessStep2 * i;
  }

  // 明度上限 100
  if (value > 100) {
    value = 100;
  }

  return value;
}
