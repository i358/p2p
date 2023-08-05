"use strict";

import type { RedisClientType } from 'redis'

export default class connectionControl {
  constructor(public redis:RedisClientType){
  }
  readTest(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let redis = this.redis;
      await redis.set("dataReadTest", "Redis")
      .catch((err)=>reject(err))
       let isExists = await redis.exists("dataReadTest").catch((err)=>reject(err))
       if(isExists) resolve(true)
       else reject(false)
       await redis.del("dataReadTest").catch((err)=>reject(err))
        resolve(true)
    })
  }
  writeTest(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      
      let redis = this.redis;
      const now = Date.now();
      redis.set("last_acknowledged", now)
      .catch((err)=>reject(err))
      const redisNow: unknown = await redis.get("last_acknowledged")
      .catch((err)=>reject(err))
      if ((redisNow as Number) == now) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }
} 