import https from 'node:https';
import { Buffer } from 'node:buffer';

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

/**
 * 发送 https 请求, 与 fetch 的主要区别是可以指定 localAddress
 * @param url
 * @param options
 * @returns
 *
 * @author iugo <code@iugo.dev>
 */
export function httpsreq(
  url: string | URL,
  {
    method = 'GET',
    body,
    localAddress,
    headers,
  }: {
    /** 请求方法 */
    method?: HttpMethod;
    /** 请求体 */
    body?: string | Buffer | Uint8Array | ReadableStream<Uint8Array> | null;
    /** 本请求所使用的网络地址 */
    localAddress?: string;
    /** 请求头 */
    headers?: Record<string, string | string[] | undefined>;
  } = {}
): Promise<Response> {
  return new Promise((resolve, reject) => {
    // 构造一个新的请求
    const req = https.request(
      url,
      {
        localAddress,
        method,
        headers,
      },
      (res) => {
        let data: Buffer = Buffer.alloc(0);
        // 响应数据, 支持数据分块传入
        res.on(
          'data',
          (chunk: Buffer) => (data = Buffer.concat([data, chunk]))
        );
        // 响应结束后, 再一次性返回数据给调用者
        res.on('end', () =>
          resolve(
            new Response(data.length ? data.buffer : null, {
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: new Headers(res.headers as Record<string, string>),
            })
          )
        );
      }
    );

    // 请求错误时, 结束请求
    req.on('error', reject);

    if (body) {
      if (body instanceof ReadableStream) {
        // 流式 body 时, 分块写入数据
        const reader = body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              req.write(Buffer.from(value));
            }
            req.end();
          } catch (error) {
            reject(error);
          }
        };
        pump();
      } else {
        // 非流式 body 时, 直接写入数据
        if (typeof body === 'string') {
          req.write(body, 'utf-8');
        } else {
          req.write(Buffer.from(body));
        }
        req.end();
      }
    } else {
      // 没有 body 时, 直接结束请求
      req.end();
    }
  });
}
