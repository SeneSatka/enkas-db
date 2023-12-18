import ChocolateMilkEmitter from "@chocolatemilkdev/emitter";
import {
  _delete,
  _deleteAll,
  _get,
  _has,
  _push,
  _set,
  _setForge,
  _pull,
} from "./methods";
import { getData, isObject, isSameObjects, pathControl, save } from "./utils";
interface Events {
  set(data: { key: string; newValue: any; oldValue: any }): any;
  delete(data: { key: string; value: any }): any;
  add(data: { key: string; newValue: number; oldValue: number }): any;
  subtract(data: { key: string; newValue: number; oldValue: number }): any;
  push(data: { key: string; pushedData: any; array: Array<any> }): any;
  pull(data: { key: string; pulledData: any; array: Array<any> }): any;
}
interface Options {
  path?: string;
  file?: string | "database";
}

export class DB<V> extends ChocolateMilkEmitter<Events> {
  private path: string;
  private file: string = "database";
  private data: object | any;
  constructor(options?: Options) {
    super();
    this.path = options?.path ?? "enkas";
    this.file = options?.file ?? "database";
    this.file = this.file.endsWith(".json")
      ? this.file.replace(".json", "")
      : this.file;
    this.file = this.file.endsWith(".json")
      ? this.file.replace(".json", "")
      : this.file;
    this.path = this.path.startsWith("/") ? this.path.slice(1) : this.path;
    this.path = this.path.endsWith("/") ? this.path.slice(0, -1) : this.path;
    this.data = {};
    pathControl(this.path);
    this.loadData();
  }

  private loadData() {
    this.data = getData(process.cwd() + "/" + this.path, this.file, "object");
  }
  private save(data?: object) {
    pathControl(this.path);
    if (typeof data === "object") this.data = data;
    save(this.path, this.file, this.data);
  }
  setForge(key: string, value: V | any) {
    const { oldValue, data } = _setForge(this.data, key, value);
    this.save(data);
    this.emit("set", { key, oldValue: oldValue, newValue: value });
  }
  set(key: string, value: V | any) {
    const { oldValue, data } = _set(this.data, key, value);
    this.save(data);
    this.emit("set", { key, oldValue: oldValue, newValue: value });
  }
  delete(key: string) {
    const { data, oldValue } = _delete(this.data, key);
    this.save(data);
    this.emit("delete", { key, value: oldValue });
  }
  deleteAll() {
    const { oldData, data } = _deleteAll(this.data);
    this.save(data);
    this.emit("delete", { key: ".", value: oldData });
  }
  has(key: string) {
    return _has(this.data, key);
  }
  get(key: string) {
    return _get(this.data, key);
  }
  all() {
    this.loadData();
    return Object.entries(this.data).map((d) => ({
      id: d[0],
      data: d[1],
    }));
  }
  fetch(key: string) {
    return this.get(key);
  }
  push(key: string, value: V | any) {
    const { array, data } = _push(this.data, key, value);
    this.save(data);
    this.emit("push", { array, key, pushedData: value });
  }
  pull(key: string, value: V | any) {
    const { array, data } = _pull(this.data, key, value);
    this.save(data);
    this.emit("pull", { array, key, pulledData: value });
  }
}
export class ArrayDB<V> extends ChocolateMilkEmitter<{
  push(data: { pushedData: any; data: Array<any> }): any;
  pull(data: { pulledData: any; data: Array<any> }): any;
  deleteAll(data: { data: any }): any;
}> {
  path: string;
  file: string = "database";
  private data: Array<V>;
  constructor(options?: Options) {
    super();
    this.path = options?.path ?? "enkas";
    this.file = options?.file ?? "database";
    this.file = this.file.endsWith(".json")
      ? this.file.replace(".json", "")
      : this.file;
    this.file = this.file.endsWith(".json")
      ? this.file.replace(".json", "")
      : this.file;
    this.path = this.path.startsWith("/") ? this.path.slice(1) : this.path;
    this.path = this.path.endsWith("/") ? this.path.slice(0, -1) : this.path;
    this.data = [];
    pathControl(this.path);
    this.loadData();
  }

  private loadData() {
    this.data = getData(process.cwd() + "/" + this.path, this.file, "array");
  }
  private save(data?: Array<V>) {
    pathControl(this.path);
    if (typeof data === "object") this.data = data;
    save(this.path, this.file, this.data);
  }
  deleteAll() {
    const old = this.data;
    this.data = [];
    this.save(this.data);
    this.emit("deleteAll", { data: old });
  }
  all() {
    this.loadData();
    return this.data;
  }
  push(value: any) {
    this.data.push(value);
    this.save(this.data);
    this.emit("push", { data: this.data, pushedData: value });
  }
  pull(value: any) {
    if (isObject(value))
      this.data = this.data.filter((k) => !isSameObjects(k, value));
    else this.data = this.data.filter((e) => e != value);
    this.save(this.data);
    this.emit("pull", { data: this.data, pulledData: value });
  }
}
