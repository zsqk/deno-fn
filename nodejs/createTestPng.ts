// createTestPng.ts
// 用于创建测试用的PNG图像

const width = 100;  // 修改为100像素宽
const height = 100; // 修改为100像素高

// 创建一个简单的黑白图像
// 二进制数据：每个像素4字节(RGBA)
const data = new Uint8Array(width * height * 4);

// 填充一个简单的图案 - 左上角和右下角为黑色区域
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;

    // 创建一个简单的黑白图案
    if ((x < 50 && y < 50) || (x >= 50 && y >= 50)) {  // 调整为50作为中点
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

// PNG编码和保存图像的逻辑
async function saveAsPng(fileName: string, data: Uint8Array, width: number, height: number) {
  // 引入PNG编码库
  const { encode } = await import("https://deno.land/x/pngs@0.1.1/mod.ts");

  // 编码为PNG
  const pngData = encode(data, width, height);

  // 保存文件
  await Deno.writeFile(fileName, pngData);
  console.log(`已创建PNG图像: ${fileName}`);
}

// 保存图像
await saveAsPng("nodejs/test.png", data, width, height);
