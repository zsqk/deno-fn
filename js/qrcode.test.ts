import QRCode from './qrcode.ts';

Deno.test('QRCode', async () => {
  const qrcode = new QRCode({ content: '中文' });

  const res = qrcode.svg();

  console.log('qrcode', res);

  await Deno.writeTextFile('test.svg', res);
});
