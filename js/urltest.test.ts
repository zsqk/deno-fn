import { assertEquals } from '@std/assert';
import { checkValidURL } from './urltest.ts';

Deno.test('test getValidURL', async () => {
  const validImg =
    'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
  const invalidImg = 'https://www.google.com/123.png';
  const data = [
    validImg,
    invalidImg,
  ];

  {
    const res = await checkValidURL(data);
    assertEquals(res, [validImg]);
  }

  {
    const res = await checkValidURL(data, { returnURL: false });
    assertEquals(res, [true, false]);
  }
});
