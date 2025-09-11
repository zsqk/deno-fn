// testImage.ts
import { encode } from "https://deno.land/x/pngs/mod.ts";

// 创建一个小型PNG图像 (50x50像素)
function createTestPng() {
  const width = 50;
  const height = 50;
  const data = new Uint8Array(width * height * 4); // RGBA格式

  // 填充图像内容 - 创建一个简单图案
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      // 绘制黑白棋盘格
      if ((x < 25 && y < 25) || (x >= 25 && y >= 25)) {
        // 黑色区域
        data[i] = 0;     // R
        data[i + 1] = 0; // G
        data[i + 2] = 0; // B
      } else {
        // 白色区域
        data[i] = 255;     // R
        data[i + 1] = 255; // G
        data[i + 2] = 255; // B
      }
      data[i + 3] = 255; // Alpha (完全不透明)
    }
  }

  // 编码为PNG
  const pngData = encode(data, width, height);

  // 保存文件
  Deno.writeFileSync("test.png", pngData);
  console.log("测试PNG文件已创建: test.png");
}

createTestPng();