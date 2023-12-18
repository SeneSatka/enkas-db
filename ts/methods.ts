import { DB } from "./Database";
import { isObject, isSameObjects } from "./utils";

export const _set = (data: Object, key: string, value: any) => {
  let d = "";
  key.split(".").forEach((e, i, a) => {
    d += `["${e}"]`;
    if (
      typeof eval(`data${d}`) !== "object" &&
      typeof eval(`data${d}`) !== "undefined" &&
      key.includes(".") &&
      i != a.length - 1
    )
      throw Error(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an Object`
      );
    if (typeof eval(`data${d}`) == "undefined") {
      eval(`data${d}={}`);
    }
  });
  const oldValue = eval(`data${d}`) ?? undefined;
  eval(`data${d}=${JSON.stringify(value)}`);
  return { oldValue, data };
};
export const _setForge = (data: Object, key: string, value: any) => {
  let d = "";
  key.split(".").forEach((e) => {
    d += `["${e}"]`;
    if (typeof eval(`data${d}`) !== "object") {
      eval(`data${d}={}`);
    }
  });
  const oldValue = eval(`data["${key.split(".")[0]}"]`) ?? undefined;
  eval(`data${d}=${JSON.stringify(value)}`);

  return { oldValue, data };
};
export const _delete = (data: Object, key: string) => {
  let d = "";
  key.split(".").forEach((e) => {
    if (d != "d") d += `["${e}"]`;
    if (typeof eval(`data${d}`) === "undefined") {
      d = "d";
    }
  });
  const oldValue = d != "d" ? eval(` data${d}`) ?? undefined : undefined;
  eval(`delete data${d}`);
  return { oldValue, data };
};
export const _deleteAll = (data: Object) => {
  const oldData = data;
  return { oldData, data: {} };
};
export const _has = (_data: Object, key: string) => {
  let d = "";
  key.split(".").forEach((e) => {
    if (d != "d") d += `["${e}"]`;
    if (typeof eval(`data${d}`) === "undefined") {
      d = "d";
    }
  });
  if (typeof eval(`data${d}`) === "undefined" || d == "d") return false;
  if (typeof eval(`data${d}`) !== "undefined") return true;
};
export const _get = (_data: Object, key: string) => {
  let d = "";
  key.split(".").forEach((e) => {
    if (d != "d") d += `["${e}"]`;
    if (typeof eval(`data${d}`) === "undefined") {
      d = "d";
    }
  });
  if (d == "d") return undefined;
  else return eval(`data${d}`);
};
export const _push = (data: Object, key: string, value: any) => {
  let d = "";
  key.split(".").forEach((e, i, a) => {
    d += `["${e}"]`;
    if (
      typeof eval(`data${d}`) !== "object" &&
      typeof eval(`data${d}`) !== "undefined" &&
      key.includes(".") &&
      i != a.length - 1
    )
      throw Error(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an Object`
      );
    if (typeof eval(`data${d}`) == "undefined") {
      eval(`data${d}={}`);
    }
  });
  if (!Array.isArray(eval(`data${d}`))) eval(`data${d}=[]`);
  eval(`data${d}`).push(value);
  return { data, array: eval(`data${d}`) };
};
export const _pull = (data: Object, key: string, value: any) => {
  let d = "";
  key.split(".").forEach((e, i, a) => {
    d += `["${e}"]`;
    if (
      typeof eval(`data${d}`) !== "object" &&
      typeof eval(`data${d}`) !== "undefined" &&
      key.includes(".") &&
      i != a.length - 1
    )
      throw Error(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an Object`
      );
    if (typeof eval(`data${d}`) === "undefined") {
      throw Error(
        `${d
          .replaceAll('"', "")
          .replaceAll("[", "")
          .replaceAll("]", ".")
          .slice(0, -1)} is not an array`
      );
    }
  });
  const a = eval(`data${d}`);
  if (Array.isArray(a)) {
    if (isObject(value))
      eval(
        `data${d}=${JSON.stringify(a.filter((k) => !isSameObjects(k, value)))}`
      );
    else eval(`data${d}=${JSON.stringify(a.filter((e) => e != value))}`);
  }
  return { data, array: eval(`data${d}`) };
};
