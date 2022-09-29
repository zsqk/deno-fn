import { genIV } from './aes.ts';

Deno.test('genIV-1', () => {
  const times = 100000;
  const l = 16;

  console.time('Math.random');
  for (let i = 0; i < times; i++) {
    genIV(l, 'Math.random');
  }
  console.timeEnd('Math.random');

  console.time('crypto.getRandomValues');
  for (let i = 0; i < times; i++) {
    genIV(l, 'getRandomValues');
  }
  console.timeEnd('crypto.getRandomValues');
});
