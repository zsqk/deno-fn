import QRCode from './qrcode.ts';

Deno.test('QRCode', () => {
  const qrcode = new QRCode({ content: '123' });
  console.log('qrcode', qrcode.svg());
});
