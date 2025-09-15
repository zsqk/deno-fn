import {
  assertSafeString,
  isSafeString,
  isStrictSafeString,
} from './string.ts';
import { assert, assertThrows } from '@std/assert';

Deno.test('isStrictSafeString', () => {
  assert(isStrictSafeString('9'));
  assert(isStrictSafeString('0'));
  assert(isStrictSafeString('a'));
  assert(isStrictSafeString('z'));
  assert(isStrictSafeString('A'));
  assert(isStrictSafeString('Z'));
  assert(isStrictSafeString('1234567890'));
  assert(!isStrictSafeString('Z_'));
  assert(!isStrictSafeString('_Z'));
  assert(!isStrictSafeString('.'));
  assert(!isStrictSafeString('a🥳'));
  assert(
    !isStrictSafeString(`
`),
  );
});

Deno.test('isSafeString', () => {
  // 基本类型检查
  assert(!isSafeString(123));
  assert(!isSafeString(null));
  assert(!isSafeString(undefined));
  assert(!isSafeString({}));
  assert(!isSafeString([]));

  // 空字符串
  assert(isSafeString(''));

  // 1. 空格 - 允许 (但不允许首尾空格)
  assert(!isSafeString(' ')); // 单个空格，首尾空格不允许
  assert(!isSafeString('  ')); // 多个空格，首尾空格不允许
  assert(isSafeString('a b')); // 中间空格允许
  assert(isSafeString('a b c')); // 中间空格允许

  // 2. 数字 (0-9) - 允许
  assert(isSafeString('0'));
  assert(isSafeString('9'));
  assert(isSafeString('1234567890'));

  // 3. 字母 (A-Z, a-z) - 允许
  assert(isSafeString('a'));
  assert(isSafeString('z'));
  assert(isSafeString('A'));
  assert(isSafeString('Z'));
  assert(isSafeString('abc'));
  assert(isSafeString('ABC'));
  assert(isSafeString('abcABC'));

  // 4. 下划线 `_` - 允许
  assert(isSafeString('_'));
  assert(isSafeString('a_b'));
  assert(isSafeString('_abc'));
  assert(isSafeString('abc_'));

  // 5. 横线 `-` - 允许
  assert(isSafeString('-'));
  assert(isSafeString('a-b'));
  assert(isSafeString('-abc'));
  assert(isSafeString('abc-'));

  // 6. 斜线 `/` - 允许 (当用户输入网址时要允许)
  assert(isSafeString('/'));
  assert(isSafeString('a/b'));
  assert(isSafeString('/abc'));
  assert(isSafeString('abc/'));
  assert(isSafeString('https://example.com'));
  assert(isSafeString('path/to/file'));

  // 7. 小括号 `(`, `)` - 允许 (当用户输入备注时要允许)
  assert(isSafeString('('));
  assert(isSafeString(')'));
  assert(isSafeString('(abc)'));
  assert(isSafeString('a(b)c'));
  assert(isSafeString('张三 (12345)'));
  assert(isSafeString('(备注信息)'));

  // 8. 点号 `.` - 允许 (当用户输入文件名时要允许)
  assert(isSafeString('.'));
  assert(isSafeString('a.b'));
  assert(isSafeString('.abc'));
  assert(isSafeString('abc.'));
  assert(isSafeString('file.txt'));
  assert(isSafeString('v1.0.0'));
  assert(isSafeString('example.com'));

  // 9. 冒号 `:` - 允许 (当用户输入时间时要允许)
  assert(isSafeString(':'));
  assert(isSafeString('a:b'));
  assert(isSafeString(':abc'));
  assert(isSafeString('abc:'));
  assert(isSafeString('10:30:00'));
  assert(isSafeString('http:'));
  assert(isSafeString('key:value'));

  // 10. 等号 `=` - 允许 (当用户输入键值对时要允许)
  assert(isSafeString('='));
  assert(isSafeString('a=b'));
  assert(isSafeString('=abc'));
  assert(isSafeString('abc='));
  assert(isSafeString('name=value'));
  assert(isSafeString('width=100'));

  // 11. 加号 `+` - 允许 (当用户输入数学运算时要允许)
  assert(isSafeString('+'));
  assert(isSafeString('a+b'));
  assert(isSafeString('+abc'));
  assert(isSafeString('abc+'));
  assert(isSafeString('1+1'));
  assert(isSafeString('v1.0+'));

  // 12. 逗号 `,` - 允许 (当用户输入列表时要允许)
  assert(isSafeString(','));
  assert(isSafeString('a,b'));
  assert(isSafeString(',abc'));
  assert(isSafeString('abc,'));
  assert(isSafeString('a,b,c'));
  assert(isSafeString('1,2,3'));

  // 13. 分号 `;` - 允许 (当用户输入分隔符时要允许)
  assert(isSafeString(';'));
  assert(isSafeString('a;b'));
  assert(isSafeString(';abc'));
  assert(isSafeString('abc;'));
  assert(isSafeString('a;b;c'));

  // 14. 感叹号 `!` - 允许 (当用户输入感叹时要允许)
  assert(isSafeString('!'));
  assert(isSafeString('Hello!'));
  assert(isSafeString('!abc'));
  assert(isSafeString('abc!'));
  assert(isSafeString('Hello! World!'));

  // 15. 百分号 `%` - 允许 (当用户输入百分比时要允许)
  assert(isSafeString('%'));
  assert(isSafeString('50%'));
  assert(isSafeString('%abc'));
  assert(isSafeString('abc%'));
  assert(isSafeString('Success rate: 95%'));

  // 16. at 符号 `@` - 允许 (当用户输入邮箱时要允许)
  assert(isSafeString('@'));
  assert(isSafeString('user@example.com'));
  assert(isSafeString('@abc'));
  assert(isSafeString('abc@'));
  assert(isSafeString('contact@company.org'));

  // 17. 井号 `#` - 允许 (当用户输入标签时要允许)
  assert(isSafeString('#'));
  assert(isSafeString('#tag'));
  assert(isSafeString('#abc'));
  assert(isSafeString('abc#'));
  assert(isSafeString('project #123'));

  // 18. 美元符号 `$` - 允许 (当用户输入变量时要允许)
  assert(isSafeString('$'));
  assert(isSafeString('$var'));
  assert(isSafeString('$abc'));
  assert(isSafeString('abc$'));
  assert(isSafeString('price: $100'));

  // 19. 问号 `?` - 允许 (当用户输入查询时要允许)
  assert(isSafeString('?'));
  assert(isSafeString('name?'));
  assert(isSafeString('?abc'));
  assert(isSafeString('abc?'));
  assert(isSafeString('What is your name?'));

  // 20. 方括号 `[`, `]` - 允许 (当用户输入数组或范围时要允许)
  assert(isSafeString('['));
  assert(isSafeString(']'));
  assert(isSafeString('[1,2,3]'));
  assert(isSafeString('[abc]'));
  assert(isSafeString('item[0]'));
  assert(isSafeString('range[1-10]'));

  // 21. 花括号 `{`, `}` - 允许 (当用户输入对象时要允许)
  assert(isSafeString('{'));
  assert(isSafeString('}'));
  assert(isSafeString('{name: value}'));
  assert(isSafeString('{abc}'));
  assert(isSafeString('config{debug: true}'));

  // 22. 波浪号 `~` - 允许 (当用户输入路径时要允许)
  assert(isSafeString('~'));
  assert(isSafeString('~/home'));
  assert(isSafeString('~abc'));
  assert(isSafeString('abc~'));
  assert(isSafeString('path: ~/documents'));

  // 23. 尖括号 `<`, `>` - 允许 (当用户输入比较或泛型时要允许)
  assert(isSafeString('<'));
  assert(isSafeString('>'));
  assert(isSafeString('x < y'));
  assert(isSafeString('a > b'));
  assert(isSafeString('List<T>'));
  assert(isSafeString('age < 18'));
  assert(isSafeString('score > 90'));

  // 24. 星号 `*` - 允许 (当用户输入通配符或强调时要允许)
  assert(isSafeString('*'));
  assert(isSafeString('*.txt'));
  assert(isSafeString('重要*'));
  assert(isSafeString('file*'));
  assert(isSafeString('*important'));
  assert(isSafeString('test*file'));

  // 组合测试
  assert(isSafeString('abc 123 _-/().:+=,;!%@#$?[]{}~<>*'));
  assert(isSafeString('file.txt (v1.0) - 2023:10:30'));
  assert(isSafeString('name=value, age=25; status=active'));
  assert(isSafeString('Hello! Success rate: 95% - contact@company.org'));
  assert(isSafeString('config{debug: true} - path: ~/home'));
  assert(isSafeString('tags: #important, price: $100, items: [1,2,3]'));
  assert(isSafeString('condition: age < 18 and score > 90'));
  assert(isSafeString('files: *.txt, *.log, important*'));

  // 中文字符 - 允许 (非 ASCII 范围)
  assert(isSafeString('中'));
  assert(isSafeString('中文'));
  assert(isSafeString('中文 123'));

  // 首尾空格检查 - 不允许
  assert(!isSafeString(' abc'));
  assert(!isSafeString('abc '));
  assert(!isSafeString(' abc '));
  assert(!isSafeString('\tabc'));
  assert(!isSafeString('abc\t'));
  assert(!isSafeString('\nabc'));
  assert(!isSafeString('abc\n'));

  // 禁止的字符测试
  assert(!isSafeString('"'));
  assert(!isSafeString('&'));
  assert(!isSafeString("'"));
  assert(!isSafeString('\\'));
  assert(!isSafeString('^'));
  assert(!isSafeString('`'));
  assert(!isSafeString('|'));

  // 禁止的 ASCII 控制字符测试
  assert(!isSafeString('\x00')); // NULL
  assert(!isSafeString('\x01')); // SOH
  assert(!isSafeString('\x02')); // STX
  assert(!isSafeString('\x03')); // ETX
  assert(!isSafeString('\x04')); // EOT
  assert(!isSafeString('\x05')); // ENQ
  assert(!isSafeString('\x06')); // ACK
  assert(!isSafeString('\x07')); // BEL
  assert(!isSafeString('\x08')); // BS
  assert(!isSafeString('\x0B')); // VT (垂直制表符)
  assert(!isSafeString('\x0C')); // FF (换页符)
  assert(!isSafeString('\x0E')); // SO
  assert(!isSafeString('\x0F')); // SI
  assert(!isSafeString('\x1F')); // US

  // 包含禁止字符的字符串
  assert(!isSafeString('abc&123'));
  assert(!isSafeString("abc'123"));
  assert(!isSafeString('abc\\123'));
  assert(!isSafeString('abc^123'));
  assert(!isSafeString('abc`123'));
  assert(!isSafeString('abc|123'));

  // 包含控制字符的字符串
  assert(!isSafeString('abc\x00def')); // 包含 NULL
  assert(!isSafeString('abc\x01def')); // 包含 SOH
  assert(!isSafeString('abc\x0Bdef')); // 包含 VT
  assert(!isSafeString('abc\x0Cdef')); // 包含 FF
  assert(!isSafeString('abc\x1Fdef')); // 包含 US
});

Deno.test('assertSafeString', () => {
  // 测试有效的安全字符串
  assertSafeString('hello');
  assertSafeString('hello world');
  assertSafeString('123');
  assertSafeString('abc-123');
  assertSafeString('file.txt');
  assertSafeString('10:30:00');
  assertSafeString('name=value');
  assertSafeString('a,b,c');
  assertSafeString('a;b;c');
  assertSafeString('(123)');
  assertSafeString('line1\nline2'); // 允许换行符

  // 测试新允许的字符
  assertSafeString('#tag');
  assertSafeString('$var');
  assertSafeString('name?');
  assertSafeString('[1,2,3]');
  assertSafeString('{key: value}');
  assertSafeString('~/home');
  assertSafeString('x < y');
  assertSafeString('List<T>');
  assertSafeString('*.txt');
  assertSafeString('重要*');

  // 测试无效的字符串（只测试真正会被拒绝的字符）
  assertThrows(
    () => assertSafeString('hello^world'),
    TypeError,
    'should be safe string but "hello^world"',
  );
  assertThrows(
    () => assertSafeString('hello&world'),
    TypeError,
    'should be safe string but "hello&world"',
  );
  assertThrows(
    () => assertSafeString('hello|world'),
    TypeError,
    'should be safe string but "hello|world"',
  );
  assertThrows(
    () => assertSafeString('hello\\world'),
    TypeError,
    'should be safe string but "hello\\\\world"',
  );
  assertThrows(
    () => assertSafeString('hello"world'),
    TypeError,
    'should be safe string but "hello\\"world"',
  );
  assertThrows(
    () => assertSafeString("hello'world"),
    TypeError,
    'should be safe string but "hello\'world"',
  );
  assertThrows(
    () => assertSafeString('hello`world'),
    TypeError,
    'should be safe string but "hello`world"',
  );
  assertThrows(
    () => assertSafeString('hello\tworld'),
    TypeError,
    'should be safe string but "hello\\tworld"',
  );
  assertThrows(
    () => assertSafeString('hello\rworld'),
    TypeError,
    'should be safe string but "hello\\rworld"',
  );
  assertThrows(
    () => assertSafeString(' hello'),
    TypeError,
    'should be safe string but " hello"',
  );
  assertThrows(
    () => assertSafeString('hello '),
    TypeError,
    'should be safe string but "hello "',
  );
  assertThrows(
    () => assertSafeString(' hello '),
    TypeError,
    'should be safe string but " hello "',
  );

  // 测试非字符串类型
  assertThrows(
    () => assertSafeString(123),
    TypeError,
    'should be safe string but 123',
  );
  assertThrows(
    () => assertSafeString(true),
    TypeError,
    'should be safe string but true',
  );
  assertThrows(
    () => assertSafeString(null),
    TypeError,
    'should be safe string but null',
  );
  assertThrows(
    () => assertSafeString(undefined),
    TypeError,
    'should be safe string but undefined',
  );
  assertThrows(
    () => assertSafeString([]),
    TypeError,
    'should be safe string but []',
  );
  assertThrows(
    () => assertSafeString({}),
    TypeError,
    'should be safe string but {}',
  );
});

Deno.test('assertSafeString with allow null', () => {
  // 测试允许 null 的情况
  assertSafeString('hello', { allow: 'null' });
  assertSafeString(null, { allow: 'null' });

  // 测试不允许 undefined 的情况
  assertThrows(
    () => assertSafeString(undefined, { allow: 'null' }),
    TypeError,
    'should be safe string but undefined',
  );
});

Deno.test('assertSafeString with allow undefined', () => {
  // 测试允许 undefined 的情况
  assertSafeString('hello', { allow: 'undefined' });
  assertSafeString(undefined, { allow: 'undefined' });

  // 测试不允许 null 的情况
  assertThrows(
    () => assertSafeString(null, { allow: 'undefined' }),
    TypeError,
    'should be safe string but null',
  );
});

Deno.test('assertSafeString with allow null-undefined', () => {
  // 测试允许 null 和 undefined 的情况
  assertSafeString('hello', { allow: 'null-undefined' });
  assertSafeString(null, { allow: 'null-undefined' });
  assertSafeString(undefined, { allow: 'null-undefined' });
});

Deno.test('assertSafeString with custom genErr', () => {
  // 测试自定义错误生成函数
  const customError = (v: unknown) =>
    new Error(`Custom: should be safe string but ${JSON.stringify(v)}`);

  assertSafeString('hello', { genErr: customError });

  assertThrows(
    () => assertSafeString(123, { genErr: customError }),
    Error,
    'Custom: should be safe string but 123',
  );
});

Deno.test('assertSafeString with allowNewlines option', () => {
  // 测试默认允许换行符
  assertSafeString('line1\nline2');
  assertSafeString('line1\nline2\nline3');

  // 测试明确允许换行符
  assertSafeString('line1\nline2', { allowNewlines: true });

  // 测试不允许换行符
  assertThrows(
    () => assertSafeString('line1\nline2', { allowNewlines: false }),
    TypeError,
    'should be safe string but "line1\\nline2"',
  );

  // 测试空字符串（没有换行符）
  assertSafeString('', { allowNewlines: false });
  assertSafeString('hello', { allowNewlines: false });

  // 测试与其他选项组合
  assertSafeString(null, { allow: 'null', allowNewlines: false });
  assertSafeString(undefined, { allow: 'undefined', allowNewlines: false });
});

Deno.test('assertSafeString with trimLines option', () => {
  // 测试默认不允许行首尾空格
  assertThrows(
    () => assertSafeString(' line1\nline2'),
    TypeError,
    'should be safe string but " line1\\nline2"',
  );
  assertThrows(
    () => assertSafeString('line1 \nline2'),
    TypeError,
    'should be safe string but "line1 \\nline2"',
  );
  assertThrows(
    () => assertSafeString(' line1 \n line2 '),
    TypeError,
    'should be safe string but " line1 \\n line2 "',
  );

  // 测试明确不允许行首尾空格
  assertThrows(
    () => assertSafeString(' line1\nline2', { trimLines: false }),
    TypeError,
    'should be safe string but " line1\\nline2"',
  );

  // 测试允许行首尾空格（但整个字符串的首尾空格仍然不允许）
  assertSafeString('line1 \nline2', { trimLines: true });
  assertSafeString('line1 \n line2', { trimLines: true });

  // 测试空字符串
  assertSafeString('', { trimLines: true });
  assertSafeString('', { trimLines: false });

  // 测试没有换行符的字符串
  assertSafeString('hello', { trimLines: true });
  assertSafeString('hello', { trimLines: false });

  // 测试与其他选项组合
  assertSafeString(null, { allow: 'null', trimLines: true });
  assertSafeString(undefined, { allow: 'undefined', trimLines: true });
});

Deno.test('assertSafeString with both allowNewlines and trimLines options', () => {
  // 测试默认行为（允许换行，不允许行首尾空格）
  assertSafeString('line1\nline2');
  assertThrows(
    () => assertSafeString(' line1\nline2'),
    TypeError,
    'should be safe string but " line1\\nline2"',
  );

  // 测试允许换行和行首尾空格
  assertSafeString('line1\nline2', { allowNewlines: true, trimLines: true });
  assertSafeString('line1 \n line2', { allowNewlines: true, trimLines: true });

  // 测试不允许换行但允许行首尾空格
  assertSafeString('line1 ', { allowNewlines: false, trimLines: true });
  assertThrows(
    () =>
      assertSafeString(' line1 \n line2 ', {
        allowNewlines: false,
        trimLines: true,
      }),
    TypeError,
    'should be safe string but " line1 \\n line2 "',
  );

  // 测试不允许换行也不允许行首尾空格
  assertSafeString('line1', { allowNewlines: false, trimLines: false });
  assertThrows(
    () =>
      assertSafeString(' line1', { allowNewlines: false, trimLines: false }),
    TypeError,
    'should be safe string but " line1"',
  );
  assertThrows(
    () =>
      assertSafeString('line1\nline2', {
        allowNewlines: false,
        trimLines: false,
      }),
    TypeError,
    'should be safe string but "line1\\nline2"',
  );

  // 测试与 allow 选项组合
  assertSafeString(null, {
    allow: 'null',
    allowNewlines: true,
    trimLines: true,
  });
  assertSafeString(undefined, {
    allow: 'undefined',
    allowNewlines: false,
    trimLines: false,
  });
});

Deno.test('assertSafeString multiline whitespace logic', () => {
  // 测试多行字符串的空格检查逻辑

  // 多行字符串，第一行有首尾空格，第二行没有 - 默认不允许行首尾空格
  assertThrows(
    () => assertSafeString(' line1\nline2'),
    TypeError,
    'should be safe string but " line1\\nline2"',
  );

  // 多行字符串，第一行没有首尾空格，第二行有 - 默认不允许行首尾空格
  assertThrows(
    () => assertSafeString('line1\n line2 '),
    TypeError,
    'should be safe string but "line1\\n line2 "',
  );

  // 多行字符串，两行都有首尾空格 - 默认不允许行首尾空格
  assertThrows(
    () => assertSafeString(' line1 \n line2 '),
    TypeError,
    'should be safe string but " line1 \\n line2 "',
  );

  // 多行字符串，允许行首尾空格 - 应该通过
  assertSafeString(' line1 \n line2 ', { trimLines: true });

  // 多行字符串，第一行有首尾空格，第二行没有 - 允许行首尾空格
  assertSafeString(' line1 \nline2', { trimLines: true });

  // 多行字符串，第一行没有首尾空格，第二行有 - 允许行首尾空格
  assertSafeString('line1\n line2 ', { trimLines: true });

  // 单行字符串有首尾空格 - 默认不允许
  assertThrows(
    () => assertSafeString(' hello '),
    TypeError,
    'should be safe string but " hello "',
  );

  // 单行字符串有首尾空格 - 允许行首尾空格
  assertSafeString(' hello ', { trimLines: true });

  // 单行字符串有尾随空格 - 默认不允许
  assertThrows(
    () => assertSafeString('hello '),
    TypeError,
    'should be safe string but "hello "',
  );

  // 单行字符串有尾随空格 - 允许行首尾空格
  assertSafeString('hello ', { trimLines: true });

  // 单行字符串有前导空格 - 默认不允许
  assertThrows(
    () => assertSafeString(' hello'),
    TypeError,
    'should be safe string but " hello"',
  );

  // 单行字符串有前导空格 - 允许行首尾空格
  assertSafeString(' hello', { trimLines: true });
});
