/**
 * 判断是否为 BufferSource
 * @param v 需要判断的值
 * @returns 是否为 BufferSource
 */
export function isBufferSource(v: unknown): v is BufferSource {
  if (v instanceof ArrayBuffer) {
    return true;
  }
  if (ArrayBuffer.isView(v)) {
    return true;
  }
  return false;
}
