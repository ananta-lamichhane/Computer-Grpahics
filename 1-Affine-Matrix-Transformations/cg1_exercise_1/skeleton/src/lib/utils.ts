
export function degToRad(deg: number){
  return deg * (Math.PI/180.0);
}

export function radToDeg(rad: number){
  return rad * (180.0/Math.PI);
}

export class Callbackable {
  _handler: Function[] = []
  constructor() {
    let watcher = {
      set: function <T extends keyof Callbackable>(obj: Callbackable, prop: T, value: Callbackable[T]) {
        obj[prop] = value;
        if (obj._handler != undefined) {
          // obj.handler.forEach((handler, idx) => handler.call(obj.parent[idx], prop, value));
          obj._handler.forEach((handler) => handler({ key: prop, value: value }));
        }
        return true;
      }
    }
    return new Proxy(this, watcher)
  }
  addCallback(handler: (KeyValuePair: KeyValuePair<Callbackable>) => void) {
    this._handler.push(handler);
  }
}

export type KeyValuePair<T> = { [N in keyof T]: { key: N, value: T[N] } }[keyof T]

/**
 * Some Typescript enum "exploit" to get the names of all enum options.
 * @param myEnum  Name of an enum
 */
export function enumOptions<T>(myEnum: T): Array<string> {
  return Object.keys(myEnum).map(k => { typeof (myEnum as any)[k] === 'string'; return (myEnum as any)[k] });
}

/**
 * Some Typescript enum "exploit" to get the keys of all enum options.
 * @param myEnum  Name of an enum
 */
export function enumKeys<T>(myEnum: T): Array<string> {
  return Object.keys(myEnum).map(k => { typeof (myEnum as any)[k] === 'string'; return k });
}

export function objectFlip<T>(myEnum: T): Object {
  return Object.keys(myEnum).reduce((ret, key) => {
    (ret as any)[(myEnum as any)[key]] = key;
    return ret;
  }, {});
}
