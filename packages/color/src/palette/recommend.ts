import { colorPalettes } from '../constant';
import { getDeltaE, getHsl, isValidColor, transformHslToHex } from '../shared';
import { getColorName } from '../shared/name';
import type {
  ColorPalette,
  ColorPaletteFamily,
  ColorPaletteFamilyWithNearstPalette,
  ColorPaletteMatch,
  ColorPaletteNumber
} from '../types';

/**
 * 获取推荐的颜色系列（带 Map 索引、主色、匹配色）
 * @param color 提供的颜色
 */
export function getRecommendedColorPalette(color: string) {
  // 获取基于预设色系生成的完整色阶集合
  const colorPattleFamily = getRecommendedColorPaletteFamily(color);

  // 将色阶数组转成 Map，key 为色阶编号（50、100...500），value 为色阶对象，方便快速查找
  const colorMap = new Map<ColorPaletteNumber, ColorPalette>();

  colorPattleFamily.palettes.forEach(palette => {
    colorMap.set(palette.number, palette);
  });

  // 取 500 号色阶作为主色，AntD 风格中 500 是最常用的标准色
  const mainColor = colorMap.get(500)!;
  // 在生成的色阶中找到与用户输入颜色 hex 完全相等的那一档作为匹配色
  const matchColor = colorPattleFamily.palettes.find(palette => palette.hex === color)!;

  // 组装完整的色板对象，包含色系名称、色阶列表、Map 索引、主色、匹配色
  const colorPalette: ColorPaletteMatch = {
    ...colorPattleFamily,
    colorMap,
    main: mainColor,
    match: matchColor
  };

  return colorPalette;
}

/**
 * 基于用户提供的颜色，生成一个完整的推荐色阶集合
 * @param color 提供的颜色
 */
export function getRecommendedColorPaletteFamily(color: string) {
  // 判断颜色值是否合法
  if (!isValidColor(color)) {
    throw new Error('Invalid color, please check color value!');
  }

  // 获取与输入颜色最相似的颜色英文名称
  let colorName = getColorName(color);

  // 将颜色名称转为小写，空格替换为 - 连接，作为色系标识
  colorName = colorName.toLowerCase().replace(/\s/g, '-');

  // 获取输入颜色的色相和饱和度
  const { h: h1, s: s1 } = getHsl(color);

  // 从预设色系中找到最接近的色系，以及其中明度最接近的色阶
  const { nearestLightnessPalette, palettes } = getNearestColorPaletteFamily(color, colorPalettes);

  // 取出明度最接近的色阶的编号和 hex 值
  const { number, hex } = nearestLightnessPalette;

  // 获取参考色阶的色相和饱和度
  const { h: h2, s: s2 } = getHsl(hex);

  // 计算输入颜色与参考色阶的色相差值
  const deltaH = h1 - h2;
  // 计算输入颜色与参考色阶的饱和度比例
  const sRatio = s1 / s2;

  /**
   * 构建最终的色阶集合
   *
   * 原理：以明度锚点为基准，把用户颜色与锚点的差异"平移"到其他色阶上。
   * 同一颜色家族中，不同色阶之间的差异主要体现在明度上，色相和饱和度应该是相近的。
   * 因此保持各色阶原始明度不变，只将色相差值和饱和度比例套用到每个色阶上，
   * 让用户颜色的风格贯穿整个色阶，同时保留预设色系的明度梯度。
   *
   * 具体过程：
   * 1. 找到明度最接近用户颜色的色阶作为锚点，直接用用户原始颜色替换
   * 2. 计算用户颜色与锚点色阶的差异：
   *    - deltaH = h1 - h2：色相差了多少度
   *    - sRatio = s1 / s2：饱和度是几倍
   * 3. 对其他色阶，保持它们原始的明度不变（l），只把色相和饱和度的差异套上去：
   *    - 新色相 = 原色相 ± deltaH
   *    - 新饱和度 = 原饱和度 × sRatio
   */
  const colorPaletteFamily: ColorPaletteFamily = {
    name: colorName,
    palettes: palettes.map(palette => {
      // 默认使用用户输入的颜色
      let hexValue = color;

      // 判断当前色阶是否是明度最接近的色阶（锚点）
      const isSame = number === palette.number;

      // 非锚点色阶：对色相和饱和度进行偏移变换，明度保持不变
      if (!isSame) {
        // 获取当前色阶原始的色相、饱和度、明度
        const { h: h3, s: s3, l } = getHsl(palette.hex);

        // 将色相差值应用到当前色阶的色相上
        const newH = deltaH < 0 ? h3 + deltaH : h3 - deltaH;
        // 将饱和度比例应用到当前色阶的饱和度上
        const newS = s3 * sRatio;

        // 将新的 HSL 值转回 hex
        hexValue = transformHslToHex({
          h: newH,
          s: newS,
          l
        });
      }

      return {
        hex: hexValue,
        number: palette.number
      };
    })
  };

  return colorPaletteFamily;
}

/**
 * 获取颜色最相似的颜色系列
 * @param color 输入颜色
 * @param families 预设颜色系列列表
 */
function getNearestColorPaletteFamily(color: string, families: ColorPaletteFamily[]) {
  // 为每个色系的每个色阶计算与目标颜色的色差（Delta E）
  const familyWithConig = families.map(family => {
    const palettes = family.palettes.map(palette => {
      return {
        ...palette,
        delta: getDeltaE(color, palette.hex)
      };
    });

    // 找出当前色系中与目标颜色最接近的单个色阶
    const nearestPalette = palettes.reduce((prev, curr) => (prev.delta < curr.delta ? prev : curr));

    return {
      ...family,
      palettes,
      nearestPalette
    };
  });

  // 在所有色系中，选出"最近色阶离目标颜色最近"的那个色系
  const nearestPaletteFamily = familyWithConig.reduce((prev, curr) =>
    prev.nearestPalette.delta < curr.nearestPalette.delta ? prev : curr
  );

  // 获取目标颜色的明度值
  const { l } = getHsl(color);
  // 在最接近的色系中，找到明度与目标颜色最接近的色阶作为锚点
  const paletteFamily: ColorPaletteFamilyWithNearstPalette = {
    ...nearestPaletteFamily,
    nearestLightnessPalette: nearestPaletteFamily.palettes.reduce((prev, curr) => {
      const { l: prevLightness } = getHsl(prev.hex);
      const { l: currLightness } = getHsl(curr.hex);

      // 比较两个色阶与目标颜色的明度差绝对值
      const deltaPrev = Math.abs(prevLightness - l);
      const delteCurr = Math.abs(currLightness - l);

      return deltaPrev < delteCurr ? prev : curr;
    })
  };

  return paletteFamily;
}
