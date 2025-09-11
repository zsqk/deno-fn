interface DnsResponse {
  question: {
    name: string;
    type: number;
    class: number;
  }[];
  answer?: {
    name: string;
    type: number;
    class: number;
    ttl: number;
    data: string;
  }[];
}

/**
 * 记录类型枚举（部分常用值）
 */
enum DnsRecordType {
  A = 1, // IPv4 地址
  NS = 2, // 名称服务器
  CNAME = 5, // 规范名称
  SOA = 6, // 权威记录
  MX = 15, // 邮件交换
  TXT = 16, // 文本记录
  AAAA = 28, // IPv6 地址
  SRV = 33, // 服务定位
  HTTPS = 65, // HTTPS 绑定 (SVCB/HTTPS)
  SVCB = 64, // 服务绑定
}

/**
 * 生成 DNS over HTTPS 的 GET 请求 URL
 * @param domain 要查询的域名 (如 "example.com")
 * @param server DoH 服务器地址 (默认 Cloudflare)
 * @param recordType DNS 记录类型 (默认为 A 记录)
 */
export function generateDoHUrl(
  domain: string,
  server = 'https://cloudflare-dns.com/dns-query',
  recordType: DnsRecordType = DnsRecordType.A, // A 记录
): string {
  // 构造 DNS 请求二进制数据
  const encoder = new TextEncoder();
  const buf = new Uint8Array(1024);
  let offset = 0;

  // DNS 头部 (12 bytes)
  const header = new Uint8Array([
    0x00,
    0x00, // ID
    0x01,
    0x00, // Flags: RD=1
    0x00,
    0x01, // Questions: 1
    0x00,
    0x00, // Answer RRs: 0
    0x00,
    0x00, // Authority RRs: 0
    0x00,
    0x00, // Additional RRs: 0
  ]);
  buf.set(header, offset);
  offset += header.length;

  // 编码域名 (www.example.com → 3www7example3com)
  domain.split('.').forEach((part) => {
    buf[offset++] = part.length; // 长度字节
    encoder.encodeInto(part, buf.subarray(offset, offset + part.length));
    offset += part.length;
  });
  buf[offset++] = 0x00; // 结束符

  // 查询类型和类
  const tail = new Uint8Array([
    (recordType >> 8) & 0xFF,
    recordType & 0xFF, // 类型
    0x00,
    0x01, // 类: IN
  ]);
  buf.set(tail, offset);
  offset += tail.length;

  // Base64URL 编码
  const dnsQuery = btoa(String.fromCharCode(...buf.subarray(0, offset)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${server}?dns=${dnsQuery}`;
}

export async function queryDoH(
  domain: string,
  recordType: DnsRecordType = DnsRecordType.A,
): Promise<DnsResponse> {
  const url = generateDoHUrl(domain, undefined, recordType);

  const response = await fetch(url, {
    headers: { 'Accept': 'application/dns-message' },
  });

  if (!response.ok) {
    throw new Error(`DNS 查询失败: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  return parseDnsMessage(new Uint8Array(buffer));
}

// DNS 响应解析器
function parseDnsMessage(data: Uint8Array): DnsResponse {
  const view = new DataView(data.buffer);
  let offset = 0;

  // 解析头部
  /**
   * DNS 报文 ID（2 字节）
   */
  const id = view.getUint16(offset);
  offset += 2;
  /**
   * DNS 标志位（2 字节）
   */
  const flags = view.getUint16(offset);
  offset += 2;
  /**
   * 问题记录数（2 字节）
   */
  const qdcount = view.getUint16(offset);
  offset += 2;
  /**
   * 回答记录数（2 字节）
   */
  const ancount = view.getUint16(offset);
  offset += 2;
  // 跳过权威和附加记录计数
  offset += 4;

  // 解析问题部分
  const question = [];
  for (let i = 0; i < qdcount; i++) {
    const { name, newOffset } = parseName(data, offset);
    offset = newOffset;
    const type = view.getUint16(offset);
    offset += 2;
    const qclass = view.getUint16(offset);
    offset += 2;
    question.push({ name, type, class: qclass });
  }

  // 解析回答部分
  const answer = [];
  for (let i = 0; i < ancount; i++) {
    const { name, newOffset } = parseName(data, offset);
    offset = newOffset;
    const type = view.getUint16(offset);
    offset += 2;
    const qclass = view.getUint16(offset);
    offset += 2;
    const ttl = view.getUint32(offset);
    offset += 4;
    const rdlength = view.getUint16(offset);
    offset += 2;
    const rdata = parseRecordData(type, data, offset, rdlength);
    offset += rdlength;

    answer.push({
      name,
      type,
      class: qclass,
      ttl,
      data: rdata,
    });
  }

  return { question, answer };
}

// 辅助函数：解析域名（处理压缩指针）
function parseName(
  data: Uint8Array,
  offset: number,
): { name: string; newOffset: number } {
  const labels = [];
  let length: number;

  while ((length = data[offset++]) !== 0) {
    if ((length & 0xC0) === 0xC0) { // 处理压缩指针
      const ptr = ((length & 0x3F) << 8) | data[offset++];
      const { name } = parseName(data, ptr);
      labels.push(name);
      return { name: labels.join('.'), newOffset: offset };
    }
    labels.push(String.fromCharCode(...data.subarray(offset, offset + length)));
    offset += length;
  }
  return { name: labels.join('.'), newOffset: offset };
}

// 解析记录数据
function parseRecordData(
  type: number,
  data: Uint8Array,
  offset: number,
  length: number,
): string {
  switch (type) {
    case DnsRecordType.A:
      return Array.from(data.subarray(offset, offset + 4)).join('.');
    case DnsRecordType.AAAA:
      return Array.from(data.subarray(offset, offset + 16))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(':').replace(/(:0){2,}/, '::');
    case DnsRecordType.CNAME:
    case DnsRecordType.NS:
      return parseName(data, offset).name;
    case DnsRecordType.TXT:
      return String.fromCharCode(...data.subarray(offset + 1, offset + length));
    default:
      return data.subarray(offset, offset + length).toString();
  }
}
