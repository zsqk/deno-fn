// printBitmap.ts
// 用于测试BITMAP命令图像打印

import { convertImageToBitmapData } from "./bitmap.ts";

/**
 * 生成完整的打印图像的TSPL命令
 * @param imagePath 图像文件路径
 * @param x 图像X坐标 (点)
 * @param y 图像Y坐标 (点)
 * @param mode 打印模式 (0=正常, 1=异或, 3=反转)
 * @param resize 可选的调整大小参数
 * @returns 完整的TSPL命令字符串
 */
async function generateBitmapPrintCommand(
  imagePath: string,
  x = 10,
  y = 10,
  mode = 0,
  resize?: { width?: number, height?: number }
): Promise<string> {
  // 获取位图数据和尺寸信息
  const imageInfo = await convertImageToBitmapData(imagePath, resize || {});

  // 创建TSPL命令
  return `
SIZE 80 mm,40 mm
GAP 0 mm,0 mm
CLS
TEXT 10,100,"TSS24.BF2",0,1,1,"图像打印测试 ${imageInfo.width*8}x${imageInfo.height}"
BITMAP ${x},${y},${imageInfo.width},${imageInfo.height},${mode},${imageInfo.bitmapData}
PRINT 1,1
`;
}

// 使用方法1: 普通打印模式
const command1 = await generateBitmapPrintCommand(
  "nodejs/test.png",
  50,    // x坐标
  150,   // y坐标
  0      // 正常模式
);
console.log("普通模式打印命令:");
console.log(command1);

// 使用方法2: 反转模式
const command2 = await generateBitmapPrintCommand(
  "nodejs/test.png",
  200,   // x坐标
  150,   // y坐标
  3      // 反转模式
);
console.log("\n反转模式打印命令:");
console.log(command2);

// 使用方法3: 调整大小后打印
const command3 = await generateBitmapPrintCommand(
  "nodejs/test.png",
  50,     // x坐标
  300,    // y坐标
  0,      // 正常模式
  { width: 50, height: 50 } // 调整为50x50像素
);
console.log("\n调整大小后打印命令:");
console.log(command3);
