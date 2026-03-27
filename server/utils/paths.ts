import { fileURLToPath } from "url";
import { dirname } from "path";

export function getDirname(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

export const serverDir = getDirname(import.meta.url);
export const projectRoot = dirname(serverDir);
