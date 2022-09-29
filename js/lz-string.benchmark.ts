// Math.trunc vs >>>
Deno.test('lz-string.benchmark-1', () => {
  const LOOP = 100000000;

  console.time('>>>');
  for (let i = 0; i < LOOP; i++) {
    (100 * Math.random()) >>> 0;
  }
  console.timeEnd('>>>');

  console.time('trunc');
  for (let i = 0; i < LOOP; i++) {
    Math.trunc(100 * Math.random());
  }
  console.timeEnd('trunc');
});

Deno.test('rest vs const', () => {
  const LOOP = 100000;
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function genKeyStr1() {
    const arr = [...str];
    const maxI = arr.length - 1;
    for (let i = 0; i < arr.length; i++) {
      const nextI = Math.trunc(maxI * Math.random());
      const a = arr[i];
      const b = arr[nextI];
      arr[i] = b;
      arr[nextI] = a;
    }
  }

  function genKeyStr2() {
    const arr = [...str];
    const maxI = arr.length - 1;
    for (let i = 0; i < arr.length; i++) {
      const nextI = Math.trunc(maxI * Math.random());
      [arr[i], arr[nextI]] = [arr[nextI], arr[i]];
    }
  }

  console.time('genKeyStr1');
  for (let i = 0; i < LOOP; i++) {
    genKeyStr1();
  }
  console.timeEnd('genKeyStr1');

  console.time('genKeyStr2');
  for (let i = 0; i < LOOP; i++) {
    genKeyStr2();
  }
  console.timeEnd('genKeyStr2');
});
