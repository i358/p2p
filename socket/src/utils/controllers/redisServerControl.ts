"use strict";

import type { RedisClientType } from "redis";
import { createClient } from "redis";
import log from "@utils/log";
import * as path from "path";
import connectionControl from "@utils/controllers/utils/connectionControl";
import colors from "colors";
import dotenv from "dotenv";
import { setTimeout } from "node:timers/promises";
const wait = setTimeout;

dotenv.config({ path: path.join(__dirname, "../../../secret/.env") });
let redisConnectionURI: string = process.env.REDIS_URI || "redis://localhost:6379"

const initalize = async (): Promise<boolean> => {
  log(colors.dim("{ring} Attempting to connect to Redis cluster"));
  await wait(1000);
  let a: string | undefined;
  const redis: RedisClientType = createClient({
    url: redisConnectionURI,
  });
  await redis.connect().catch((err) => {
    return log(
      "{error} An error occurred during connecting to the Redis server -> " +
        err,
      colors.red
    );
  });
  log("{success} Successfully connected to Redis Server.", colors.cyan);
  a = "ok";
  if (a !== "ok") return false;
  log("{ring} Attempting to read data from Redis cluster", colors.dim);
  let cc = new connectionControl(redis);
  await cc.readTest().catch(() => {
    return log(
      "{error} An error occurred during reading data from Redis cluster.",
      colors.red
    );
  });
  log("{success} Successfully read data from Redis cluster.", colors.cyan);
  log("{ring} Attempting to write data to Redis cluster", colors.dim);
  await cc.writeTest().catch(() => {
    return log(
      "{error} An error occurred during writing data to Redis cluster.",
      colors.red
    );
  });
  log("{success} Successfully wrote data to Redis cluster.", colors.cyan);
  redis.quit();
  log("{online} Redis server connection successfully initialized.");
  return true;
};

const background = (): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    const redis: RedisClientType = createClient({
      url: redisConnectionURI,
    });
    await redis
      .connect()
      .then(async () => {
        resolve(true);
      })
      .catch(() => reject(false));
  });
};

export const init = initalize;
export const control = background;
