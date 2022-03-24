/**
 * 将 CSV 文本转为数组
 *
 * 功能点:
 *
 * 1. 将 CSV 转为二维数组.
 * 2. TODO 将 CSV 转为对象数组.
 * 3. TODO 识别双引号.
 * 4. TODO 支持 CSV header.
 * 5. 去除额外的空格.
 */
export function csv2array(
  csv: string,
  opt: {
    /** 为数据指定的 CSV header */
    header?: string[];
    /** CSV 是否包含 header */
    hasHeader?: boolean;
  } = {},
): string[][] {
  const { header, hasHeader = false } = opt;
  if (header) {
    throw new Error('TODO');
  }
  if (hasHeader) {
    throw new Error('TODO');
  }
  // 如果不考虑双引号, 则比较简单
  return csv
    .split(
      `
`,
    )
    .map((v) => v.split(',').map((v) => v.trim()));
}
