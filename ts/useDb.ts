import { ArrayDB, DB } from "./Database";
interface Options {
  path?: string;
  file?: string | "database";
}

export const useDb = (options?: Options) =>
  new DB({
    file: options?.file ?? "database",
    path: options?.path ?? undefined,
  });
export const useArrayDb = (options?: Options) =>
  new ArrayDB({
    file: options?.file ?? "database",
    path: options?.path ?? undefined,
  });
