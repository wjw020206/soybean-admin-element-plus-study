import { colord, extend } from 'colord';
import type { AnyColor, HslColor } from 'colord';
import labPlugin from 'colord/plugins/lab';
import mixPlugin from 'colord/plugins/mix';

// 扩展 colord，启用 Lab 色彩空间（用于 Delta E 色差计算）和颜色混合插件
extend([labPlugin, mixPlugin]);

/**
 * 判断颜色是否合法
 * @param color 颜色值
 * @returns 是否为合法颜色
 */
export function isValidColor(color: AnyColor) {
  return colord(color).isValid();
}

/**
 * 获取十六进制格式的颜色
 * @param color 颜色值
 * @returns hex 格式的颜色字符串
 */
export function getHex(color: AnyColor) {
  return colord(color).toHex();
}

/**
 * 获取 RGB 格式的颜色
 * @param color 颜色值
 * @returns RGB 格式的颜色对象 { r, g, b, a }
 */
export function getRgb(color: AnyColor) {
  return colord(color).toRgb();
}

/**
 * 获取 HSL 格式的颜色
 * @param color 颜色值
 * @returns HSL 格式的颜色对象 { h, s, l, a }
 */
export function getHsl(color: AnyColor) {
  return colord(color).toHsl();
}

/**
 * 获取 HSV 格式的颜色
 * @param color 颜色值
 * @returns HSV 格式的颜色对象 { h, s, v, a }
 */
export function getHsv(color: AnyColor) {
  return colord(color).toHsv();
}

/**
 * 计算两种颜色之间的感知色差（Delta E）
 * 基于 Lab 色彩空间，返回 0~1 之间的值，0 表示完全相同，1 表示完全不同
 * @param color1 第一种颜色
 * @param color2 第二种颜色
 * @returns 色差值
 */
export function getDeltaE(color1: AnyColor, color2: AnyColor) {
  return colord(color1).delta(color2);
}

/**
 * 将 HSL 格式的颜色转换为十六进制格式
 * @param color HSL 格式的颜色对象
 * @returns hex 格式的颜色字符串
 */
export function transformHslToHex(color: HslColor) {
  return colord(color).toHex();
}

/**
 * 混合两种颜色
 * @param firstColor 第一种颜色（基底色）
 * @param secondColor 第二种颜色（混合色）
 * @param ratio 第二种颜色的比例 (0~1)，值越大第二种颜色占比越高
 * @returns 混合后的 hex 格式颜色
 */
export function mixColor(firstColor: AnyColor, secondColor: AnyColor, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}
