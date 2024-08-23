import { LogLevel } from '../ts/log.ts';

/**
 * 获取 URL 的有效性
 * @param urls 需要判断有效性的 URLs
 * @param options.returnURL 默认为返回有效 URLs
 * @param options.log 默认日志级别为无日志
 *
 * @author iugo <code@iugo.dev>
 */
export function checkValidURL(
  urls: string[],
  options?: { returnURL?: true; log?: LogLevel },
): Promise<string[]>;
export function checkValidURL(
  urls: string[],
  options: { returnURL: false; log?: LogLevel },
): Promise<boolean[]>;
export async function checkValidURL(
  /** 需要判断有效性的 URLs */
  urls: string[],
  { returnURL = true, log = LogLevel.None }: {
    returnURL?: boolean;
    log?: LogLevel;
  } = {},
): Promise<string[] | boolean[]> {
  const validInfo = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url);
        if (res.body) {
          await res.body.cancel();
        }
        if (log >= LogLevel.Info) {
          console.log(url, res);
          console.log({
            'res.url': res.url,
            'res.status': res.status,
          });
        }
        return res.ok;
      } catch (err) {
        if (log >= LogLevel.Warn) {
          console.error(url, err);
        }
        return false;
      }
    }),
  );
  if (returnURL) {
    return urls.filter((_, i) => validInfo[i]);
  }
  return validInfo;
}
