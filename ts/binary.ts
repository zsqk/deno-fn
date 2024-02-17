export type BufferSource = ArrayBufferView | ArrayBuffer;

export function isBufferSource(v: unknown): v is BufferSource {
  if (v instanceof ArrayBuffer) {
    return true;
  }
  if (ArrayBuffer.isView(v)) {
    return true;
  }
  return false;
}
