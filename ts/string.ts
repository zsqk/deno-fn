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
export function isSafeString(value: unknown): value is SafeString {
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
  // 拒绝危险字符：! " # $ % & ' * < > ? @ [ \ ] ^ ` { | } ~ 以及制表符和回车符
  if (/[\x21-\x27\x2A\x3C\x3E\x3F\x40\x5B-\x5E\x60\x7B-\x7E\t\r]/.test(value)) {
    return false;
  }
  // 检查是否包含首尾空格
  if (value !== value.trim()) {
    return false;
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
