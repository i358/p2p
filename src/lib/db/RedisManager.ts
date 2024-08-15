import { createClient } from "redis";

let { MODE, REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOSTNAME, REDIS_PORT } =
  process.env;

const cc = () => {
  return createClient({
    url: MODE==="prod" ? `rediss://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOSTNAME}:${
      REDIS_PORT || 6379
    }` : `redis://:@localhost:${REDIS_PORT}` 
  });
};

export class RedisManager {
  async Set(opt: { key: any; val: any }) {
    let { key, val } = opt;
    if (!key || !val) throw "";
    return new Promise(async (resolve: any, reject: any) => {
      let client = cc();
      await client.connect();
      await client.set(key, val);
      let res = await client.get(key);
      await client.quit();
      if (res === val) resolve(true);
      else resolve(false);
    });
  }
  async Get(key: any) {
    if (!key) throw "";
    return new Promise(async (resolve: any, reject: any) => {
        let client = cc();
      await client.connect();
      let exists = await client.exists(key);
      let res = await client.get(key);
      await client.quit();
      if (!exists) reject(false);
      if (exists) resolve(res);
    });
  }
  async Exists(key: any) {
    if (!key) throw "";
    return new Promise(async (resolve: any, reject: any) => {
        let client = cc();
      await client.connect();
      let exists = await client.exists(key);
      await client.quit();
      if (exists) resolve(true);
      else resolve(false);
    });
  }
  async Delete(key: any) {
    if (!key) throw "";
    return new Promise(async (resolve: any, reject: any) => {
    let client = cc();
      await client.connect();
      let exists = await client.exists(key);
      if (exists) {
        await client.del(key);
        let r = await client.exists(key);
        await client.quit();
        if (r) resolve(true);
      } else {
        await client.quit();
        resolve(false);
      }
    });
  }
}
