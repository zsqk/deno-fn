/** 字符串形式的 URL */
export type URLString = string;

/** base64 编码后的字符串 */
export type Base64String = string;

/** JWT 格式的字符串 */
export type JWTString = string;

/** 手机号码 */
export type PhoneNum = string;

/**
 * [类型] 不包含英文特殊字符 (ASCII 范围内除了字母, 数字, 下划线和空格以外的字符)
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
  // 检查每一个字符是否包含 ASCII 范围内的特殊字符, 仅允许:
  // 1. 空格
  // 2. 数字 (0-9)
  // 3. 字母 (包含大小写, A-Z, a-z)
  // 4. 下划线 (_)
  if (!/^[\w ]*$/.test(value)) {
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
