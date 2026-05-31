/**
 * 颜色色阶编号
 * 主色编号为 500，从 50（最浅）到 950（最深）
 */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * 单个色阶对象
 */
export type ColorPalette = {
  /** 颜色的十六进制值 */
  hex: string;
  /** 色阶编号 */
  number: ColorPaletteNumber;
};

/**
 * 颜色系列，包含名称和完整的色阶列表
 */
export type ColorPaletteFamily = {
  /** 颜色系列名称（如 vivid-blue） */
  name: string;
  /** 该系列包含的所有色阶 */
  palettes: ColorPalette[];
};

/**
 * 带色差信息的色阶对象
 */
export type ColorPaletteWithDelta = ColorPalette & {
  /** 与目标颜色的色差值（Delta E），0~1 之间，越小越接近 */
  delta: number;
};

/**
 * 包含最近色阶信息的颜色系列
 * 用于 getNearestColorPaletteFamily 的返回值
 */
export type ColorPaletteFamilyWithNearstPalette = ColorPaletteFamily & {
  /** 色差最小的色阶（整体颜色最接近） */
  nearestPalette: ColorPaletteWithDelta;
  /** 明度最接近的色阶（作为偏移锚点） */
  nearestLightnessPalette: ColorPaletteWithDelta;
};

/**
 * 完整的匹配颜色系列
 * 用于 getRecommendedColorPalette 的返回值
 */
export type ColorPaletteMatch = ColorPaletteFamily & {
  /** 色阶编号到色阶对象的映射，方便通过编号快速查找 */
  colorMap: Map<ColorPaletteNumber, ColorPalette>;
  /** 主色，即 500 号色阶，UI 中最常用的标准色 */
  main: ColorPalette;
  /** 匹配色，与用户输入颜色 hex 完全相等的色阶 */
  match: ColorPalette;
};

/**
 * AntD 风格色板的颜色索引
 * 从左到右颜色由浅到深，6 为主色
 */
export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
