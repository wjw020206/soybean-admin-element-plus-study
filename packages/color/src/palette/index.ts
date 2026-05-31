import type { AnyColor } from 'colord';
import type { ColorPaletteNumber } from '../types';
import { getHex } from '../shared';
import { getRecommendedColorPalette } from './recommend';
import { getAntDColorPalette } from './antd';

/**
 * 根据提供的颜色获取相关的色阶（50 ~ 950）
 * @param color 提供的颜色
 * @param recommended 是否获取推荐的色阶（提供的颜色可能不是主色）
 */
export function getColorPalette(color: AnyColor, recommended = false) {
  const colorMap = new Map<ColorPaletteNumber, string>();

  // 判断是否启用推荐的颜色系列
  if (recommended) {
    const colorPalette = getRecommendedColorPalette(getHex(color));
    colorPalette.palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });
  } else {
    const colors = getAntDColorPalette(color);

    const colorNumbers: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index]);
    });
  }

  return colorMap;
}
