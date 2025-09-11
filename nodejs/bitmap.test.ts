import { convertImageToBitmapData } from './bitmap.ts';

Deno.test('convertImageToBitmapData', async () => {
  const bitmapData = await convertImageToBitmapData('test.png');
  console.log(bitmapData);
  console.log(`BITMAP 0,0,${bitmapData.width},${bitmapData.height},${1},${bitmapData.bitmapData}`);
});
