import base64url from "base64url";
import moment from "moment";

type SnowflakeID = string;
export class Snowflake {
  private readonly workerId: bigint;
  private readonly epoch: bigint;
  private sequence: bigint;
  private lastTimestamp: bigint;

  constructor(
    workerId = 1n,
    epoch: bigint = BigInt(Number(process.env.EPOCH_TIMESTAMP))
  ) {
    this.workerId = workerId;
    this.epoch = epoch;
    this.sequence = 0n;
    this.lastTimestamp = -1n;
  }

  createUUID(
    config: { encoding: "base64url" | "none" },
    timestamp: bigint = BigInt(moment().valueOf())
  ): Promise<SnowflakeID> {
    return new Promise((resolve, reject) => {
      if (timestamp < this.lastTimestamp) {
        throw new Error("Invalid system clock");
      }

      if (timestamp === this.lastTimestamp) {
        this.sequence = (this.sequence + 1n) & 4095n;
        if (this.sequence === 0n) {
          // Wait for next millisecond
          timestamp = this.waitNextMillis(timestamp);
        }
      } else {
        this.sequence = 0n;
      }

      this.lastTimestamp = timestamp;

      const snowflake =
        ((timestamp - this.epoch) << 22n) |
        (this.workerId << 12n) |
        this.sequence;
      let res =
        config.encoding === "base64url"
          ? base64url.fromBase64(
              Buffer.from(snowflake.toString(), "utf-8").toString("base64")
            )
          : snowflake.toString();
      resolve(res);
    });
  }
  currentTimestamp(): bigint {
    return BigInt(moment.utc().valueOf());
  }

  waitNextMillis(timestamp: bigint): bigint {
    while (timestamp <= this.lastTimestamp || this.sequence >= 4096n) {
      timestamp = this.currentTimestamp();
    }
    return timestamp;
  }
  parseUUID(
    uid: SnowflakeID,
    config: { encoding: "base64url" | "none" }
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!uid) reject(new Error("Snowflake ID is missing."));
      uid =
        config.encoding === "base64url"
          ? Buffer.from(uid, "base64url").toString("utf-8")
          : uid;
      const snowflake = BigInt(uid);
      const timestamp = (snowflake >> 22n) + this.epoch;
      resolve(timestamp);
    });
  }
}
