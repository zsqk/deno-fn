export function isRecord(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) {
    return false;
  }
  return true;
}
