import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
export const getData = (
  path: string,
  file: string,
  type?: "array" | "object"
) => {
  if (!readdirSync(path).includes(file + ".json")) {
    writeFileSync(
      path + "/" + file + ".json",
      JSON.stringify({}, null, 1),
      "utf-8"
    );
  }
  let d = readFileSync(path + "/" + file + ".json", "utf-8").trim();
  type ??= "object";
  if (type == "object" && (!d.startsWith("{") || !d.endsWith("}"))) {
    writeFileSync(
      path + "/" + file + ".json",
      JSON.stringify({}, null, 1),
      "utf-8"
    );
  } else if (type == "array" && (!d.startsWith("[") || !d.endsWith("]")))
    writeFileSync(
      path + "/" + file + ".json",
      JSON.stringify([], null, 1),
      "utf-8"
    );
  return JSON.parse(readFileSync(path + "/" + file + ".json", "utf-8"));
};
export const pathControl = (path: string) => {
  if (!readdirSync(process.cwd()).includes(path)) {
    if (path == ".") return;
    let dirs = "./";
    for (const dir of path.split("/")) {
      if (!readdirSync(dirs).includes(dir)) mkdirSync(dirs + dir);
      dirs += dir + "/";
    }
  }
};
export const save = (path: string, file: string, data: object) =>
  writeFileSync(
    process.cwd() + "/" + path + "/" + file + ".json",
    JSON.stringify(data, null, 2),
    "utf-8"
  );
export const isSameArrays = (a: Array<any>, b: Array<any>) => {
  let isSome = true;
  a.forEach((e, i) => {
    if (!b.includes(e)) isSome = false;
  });
  return isSome;
};
export const isObject = (o: any) => {
  return typeof o == "object" && !Array.isArray(o);
};
export const isSameObjects = (val1: any, val2: any) => {
  let isSome = true;
  Object.keys(val1).forEach((e) => {
    if (isObject(val1[e])) {
      if (!isSameObjects(val1[e], val2[e])) isSome = false;
    } else if (Array.isArray(val1[e])) {
      if (!isSameArrays(val1[e], val2[e])) isSome = false;
    } else if (val1[e] !== val2[e]) {
      isSome = false;
    }
  });
  return isSome;
};
