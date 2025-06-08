import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";




export function cache<Args extends unknown[], Return>(
  cb: (...args: Args) => Promise<Return>,
  keyparts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyparts, options);
}
