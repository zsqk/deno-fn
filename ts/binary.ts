/**
 * 判断是否为 BufferSource
 *
 * @param v 需要判断的值
 * @returns 是否为 BufferSource
 *
 * BufferSource 曾经是自定义类型, 现在被内嵌到 Deno 中 (以符合 Web API 规范).
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
