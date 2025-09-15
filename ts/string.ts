/** 字符串形式的 URL */
export type URLString = string;

/** base64 编码后的字符串 */
export type Base64String = string;

/** JWT 格式的字符串 */
export type JWTString = string;

/** 手机号码 */
export type PhoneNum = string;

/**
 * [Type] Strict safe string (only contains a-z, A-Z, 0-9)
 * [类型] 严格安全的字符串 (仅包含 a-z, A-Z, 0-9)
 *
 * @author iugo <code@iugo.dev>
 */
export type StrictSafeString = string;

/**
 * Check if a string is strictly safe (only contains a-z, A-Z, 0-9)
 * 检查字符串是否为严格安全的字符串 (仅包含 a-z, A-Z, 0-9)
 *
 * @param str String to check
 * @returns Whether the string is strictly safe
 */
export function isStrictSafeString(str: string): str is StrictSafeString {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * [类型] 不包含危险特殊字符的字符串 (ASCII 范围内除了危险字符以外的字符)
 * @author iugo <code@iugo.dev>
 */
export type SafeString = string;

/**
 * [参数检查函数] 检查参数是否为安全的字符串
 * @author iugo <code@iugo.dev>
 */
/**
 * 基础的安全字符串检查（不检查首尾空格）
 */
function isSafeStringBasic(value: unknown): value is SafeString {
  if (typeof value !== 'string') {
    return false;
  }
  // 在 ASCII 范围内, 仅允许下列特殊字符:
  // 1. 空格
  // 2. 数字 (0-9)
  // 3. 字母 (包含大小写, A-Z, a-z)
  // 4. 下划线 `_`
  // 5. 横线 `-`
  // 6. 斜线 `/` (当用户输入网址时要允许)
  // 7. 小括号 `(`, `)` (当用户输入备注时要允许, 比如 `张三 (12345)`)
  // 8. 点号 `.` (当用户输入文件名时要允许, 比如 `file.txt`)
  // 9. 冒号 `:` (当用户输入时间时要允许, 比如 `10:30:00`)
  // 10. 等号 `=` (当用户输入键值对时要允许, 比如 `name=value`)
  // 11. 加号 `+` (当用户输入数学运算时要允许, 比如 `1+1`)
  // 12. 逗号 `,` (当用户输入列表时要允许, 比如 `a,b,c`)
  // 13. 分号 `;` (当用户输入分隔符时要允许, 比如 `a;b;c`)
  // 14. 换行符 `\n` (允许换行，但不允许制表符和回车符)
  // 15. 感叹号 `!` (当用户输入感叹时要允许, 比如 `Hello!`)
  // 16. 百分号 `%` (当用户输入百分比时要允许, 比如 `50%`)
  // 17. at 符号 `@` (当用户输入邮箱时要允许, 比如 `user@example.com`)
  // 18. 井号 `#` (当用户输入标签时要允许, 比如 `#tag`)
  // 19. 美元符号 `$` (当用户输入变量时要允许, 比如 `$var`)
  // 20. 问号 `?` (当用户输入查询时要允许, 比如 `name?`)
  // 21. 方括号 `[`, `]` (当用户输入数组或范围时要允许, 比如 `[1,2,3]`)
  // 22. 花括号 `{`, `}` (当用户输入对象时要允许, 比如 `{name: "value"}`)
  // 23. 波浪号 `~` (当用户输入路径时要允许, 比如 `~/home`)
  // 24. 尖括号 `<`, `>` (当用户输入比较或泛型时要允许, 比如 `x < y` 或 `List<T>`)
  // 25. 星号 `*` (当用户输入通配符或强调时要允许, 比如 `*.txt` 或 `重要*`)
  // 拒绝危险字符和控制字符：
  // 1. 危险字符：" & ' \ ^ ` |
  // 2. 制表符和回车符：\t \r
  // 3. 其他 ASCII 控制字符：\x00-\x08, \x0B, \x0C, \x0E-\x1F
  if (
    // deno-lint-ignore no-control-regex
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x22\x26-\x27\x5C\x5E\x60\x7C\t\r]/.test(
      value,
    )
  ) {
    return false;
  }
  return true;
}

export function isSafeString(value: unknown): value is SafeString {
  if (!isSafeStringBasic(value)) {
    return false;
  }
  // 检查是否包含首尾空格（整个字符串的首尾空格）
  if (value !== value.trim()) {
    return false;
  }
  return true;
}

/**
 * 检查字符串是否满足指定的格式要求
 * @param str 要检查的字符串
 * @param options 检查选项
 * @param options.allowNewlines 是否允许换行符，默认为 true
 * @param options.trimLines 是否允许每行首尾有空格，默认为 false (不允许)
 * @returns 是否满足要求
 */
function isValidStringWithOptions(
  str: string,
  {
    allowNewlines = true,
    trimLines = false,
  }: {
    allowNewlines?: boolean;
    trimLines?: boolean;
  } = {},
): boolean {
  // 如果不允许换行符，检查是否包含换行符
  if (!allowNewlines && str.includes('\n')) {
    return false;
  }

  // 如果不允许行首尾空格，检查每行是否有首尾空格
  if (!trimLines) {
    const lines = str.split('\n');
    for (const line of lines) {
      if (line !== line.trim()) {
        return false;
      }
    }
  }

  return true;
}

/**
 * [类型] 有效的字符串 (非空字符串)
 * @author iugo <code@iugo.dev>
 */
export type ValidString = string;

/**
 * [参数检查函数] 检查参数是否为有效的字符串 (非空字符串)
 * @author iugo <code@iugo.dev>
 */
export function isValidString(value: unknown): value is ValidString {
  return isSafeString(value) && value.length > 0;
}

/**
 * 断言传入值是一个安全字符串
 * 默认情况下只允许安全字符串，不允许 null 或 undefined
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 额外允许的值类型, 默认不允许
 * @param options.allowNewlines 是否允许换行符, 默认为 true
 * @param options.trimLines 是否允许每行首尾有空格, 默认为 false (不允许)
 * @returns 断言 v 是 SafeString 类型
 */
export function assertSafeString(
  v: unknown,
  options?: {
    genErr?: (v: unknown) => Error;
    allow?: never;
    allowNewlines?: boolean;
    trimLines?: boolean;
  },
): asserts v is SafeString;

/**
 * 断言传入值是一个安全字符串或 null
 * 允许传入 null 值，其他情况必须为安全字符串
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null'，表示允许 null 值
 * @param options.allowNewlines 是否允许换行符, 默认为 true
 * @param options.trimLines 是否允许每行首尾有空格, 默认为 false (不允许)
 * @returns 断言 v 是 SafeString | null 类型
 */
export function assertSafeString(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null';
    allowNewlines?: boolean;
    trimLines?: boolean;
  },
): asserts v is SafeString | null;

/**
 * 断言传入值是一个安全字符串或 undefined
 * 允许传入 undefined 值，其他情况必须为安全字符串
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'undefined'，表示允许 undefined 值
 * @param options.allowNewlines 是否允许换行符, 默认为 true
 * @param options.trimLines 是否允许每行首尾有空格, 默认为 false (不允许)
 * @returns 断言 v 是 SafeString | undefined 类型
 */
export function assertSafeString(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'undefined';
    allowNewlines?: boolean;
    trimLines?: boolean;
  },
): asserts v is SafeString | undefined;

/**
 * 断言传入值是一个安全字符串、null 或 undefined
 * 允许传入 null 和 undefined 值，其他情况必须为安全字符串
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null-undefined'，表示允许 null 和 undefined 值
 * @param options.allowNewlines 是否允许换行符, 默认为 true
 * @param options.trimLines 是否允许每行首尾有空格, 默认为 false (不允许)
 * @returns 断言 v 是 SafeString | null | undefined 类型
 */
export function assertSafeString(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null-undefined';
    allowNewlines?: boolean;
    trimLines?: boolean;
  },
): asserts v is SafeString | null | undefined;

export function assertSafeString(
  v: unknown,
  {
    genErr = () =>
      new TypeError(`should be safe string but ${JSON.stringify(v)}`),
    allow,
    allowNewlines = true,
    trimLines = false,
  }: {
    genErr?: (v: unknown) => Error;
    allow?: 'null' | 'undefined' | 'null-undefined';
    allowNewlines?: boolean;
    trimLines?: boolean;
  } = {},
): asserts v is SafeString | null | undefined {
  // 如果值为 null，检查是否允许
  if (v === null) {
    if (allow === 'null' || allow === 'null-undefined') {
      return;
    }
    throw genErr(v);
  }

  // 如果值为 undefined，检查是否允许
  if (v === undefined) {
    if (allow === 'undefined' || allow === 'null-undefined') {
      return;
    }
    throw genErr(v);
  }

  // 检查是否为安全字符串（不检查首尾空格，因为我们有专门的逻辑处理）
  if (!isSafeStringBasic(v)) {
    throw genErr(v);
  }

  // 检查换行符和行首尾空格
  if (!isValidStringWithOptions(v, { allowNewlines, trimLines })) {
    throw genErr(v);
  }
}
