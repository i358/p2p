import { createClient } from "redis";
import type { RedisClientType } from "redis";

let redisConnectionURI: string = process.env.REDIS_URI || "redis://localhost:6379"

export default class redisConnector {
  set(data: { key: any; value: any }): Promise<any> {
    const key = data.key;
    const value = data.value;
    return new Promise<any>(async (resolve, reject) => {
      let client = this.createClient();
      client
        .connect()
        .then(async () => {
          client.set(key, value);
          let read: any = await client.get(key);
          if (read === value) return resolve(true);
          client.quit();
          resolve(false);
        })
        .catch((err: { message: any }) => reject(err.message));
    });
  }
  get(key: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let client = this.createClient();
      client
        .connect()
        .then(async () => {
          let isExists = await client.exists(key);
          if (!isExists) return resolve(false);
          let dd = await client.get(key);
          client.quit();
          resolve(dd);
        })
        .catch((err: { message: any }) => reject(err.message));
    });
  }
  exist(key: any): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      let client = this.createClient();
      client
        .connect()
        .then(async () => {
          let isExists: unknown = await client.exists(key);
          if (!(isExists as boolean)) return resolve(false);
          client.quit();
          resolve(true);
        })
        .catch((err: { message: any }) => reject(err.message));
    });
  }
  del(key: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let isExists: unknown = await this.exist(key);
      if (!(isExists as boolean)) return resolve({ err_code: "exists_0" });
      let client = this.createClient();
      client
        .connect()
        .then(async () => {
          await client.del(key);
          let isExists_: unknown = await this.exist(key);
          if (isExists_ as boolean) return resolve(false);
          client.quit();
          resolve(true);
        })
        .catch((err: { message: any }) => reject(err.message));
    });
  }
  createClient() {
    var client: RedisClientType = createClient({
      url: redisConnectionURI,
    });
    return client;
  }
}
