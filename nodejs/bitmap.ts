// Deno图像处理 - 不依赖Node.js native模块
// 使用标准库的编码解码器处理图像

/**
 * 将图像转换为打印机可用的bitmap_data格式
 * @param imagePath 图像文件路径
 * @param opt 可选参数，包含期望的宽度和高度
 * @returns 返回包含宽度(字节数)、高度和bitmap_data的对象
 */
export async function convertImageToBitmapData(
  imagePath: string,
  opt: {
    /** 图像宽度 */
    width?: number,
    /** 图像高度 */
    height?: number,
  } = {}
): Promise<{
  /** 图像宽度，注意：单位是字节数，而非像素数 */
  width: number,
  /** 图像高度（单位：点/像素） */
  height: number,
  /** 图像的bitmap_data字符串(十六进制) */
  bitmapData: string
}> {
  // 读取图像文件
  const imageData = await Deno.readFile(imagePath);

  // 使用pngs库解码PNG图像
  const { decode } = await import("https://deno.land/x/pngs@0.1.1/mod.ts");

  // 解码图像数据
  const result = decode(imageData);
  let origWidth = result.width;
  let origHeight = result.height;
  let pixels = result.image;

  // 处理可选的调整大小参数
  const targetWidth = opt.width || origWidth;
  const targetHeight = opt.height || origHeight;

  // 如果需要调整图像大小
  if (targetWidth !== origWidth || targetHeight !== origHeight) {
    // 这里我们简单实现一个最近邻插值的缩放算法
    // 对于生产环境，建议使用专业的图像处理库
    const newPixels = new Uint8Array(targetWidth * targetHeight * 4);

    const xRatio = origWidth / targetWidth;
    const yRatio = origHeight / targetHeight;

    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const srcX = Math.floor(x * xRatio);
        const srcY = Math.floor(y * yRatio);

        const srcIndex = (srcY * origWidth + srcX) * 4;
        const destIndex = (y * targetWidth + x) * 4;

        // 复制RGBA值
        newPixels[destIndex] = pixels[srcIndex];        // R
        newPixels[destIndex + 1] = pixels[srcIndex + 1]; // G
        newPixels[destIndex + 2] = pixels[srcIndex + 2]; // B
        newPixels[destIndex + 3] = pixels[srcIndex + 3]; // A
      }
    }

    pixels = newPixels;
    origWidth = targetWidth;
    origHeight = targetHeight;
  }

  // 计算每行所需字节数
  const bytesPerLine = Math.ceil(origWidth / 8);
  let bitmapData = '';

  // 转换为TSC打印机所需的bitmap格式
  // 注意：TSC打印机的BITMAP命令中，1表示打印点，0表示不打印
  for (let y = 0; y < origHeight; y++) {
    for (let x = 0; x < bytesPerLine; x++) {
      let byteValue = 0;

      // 处理这个字节的8个像素
      for (let bit = 0; bit < 8; bit++) {
        const pixelX = x * 8 + bit;

        // 如果超出图像宽度，则跳过
        if (pixelX >= origWidth) continue;

        // RGBA格式，每个像素占4字节
        const pixelIndex = (y * origWidth + pixelX) * 4;

        // 计算灰度值 (R*0.3 + G*0.59 + B*0.11)
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        const gray = r * 0.3 + g * 0.59 + b * 0.11;

        // 二值化：对于打印机，白色是背景(0)，黑色才会打印(1)
        // 灰度小于128表示更接近黑色，因此设置为1
        if (gray < 128) {
          // 设置对应位为1，表示打印此点
          // 注意：TSC打印机BITMAP命令的位顺序是从左到右
          byteValue |= (1 << (7 - bit));
        }
      }

      // 将字节转为16进制字符串
      bitmapData += byteValue.toString(16).padStart(2, '0');
    }
  }

  // 返回包含宽度(字节数)、高度和位图数据的对象
  return {
    width: bytesPerLine,
    height: origHeight,
    bitmapData
  };
}
