import base64url from "base64url";
import moment from "moment";

export class Timestamp {
  async Convert(
    config: { encoding: "base64url" | "hex" },
    timestamp: "none" | number
  ): Promise<string | boolean> {
    const epoch = Number(process.env.EPOCH_TIMESTAMP);
    const currentTimestamp =
      timestamp === "none" ? moment().valueOf() : timestamp;
    const secondsSinceEpoch = currentTimestamp - epoch;
    const hexTimestamp = secondsSinceEpoch.toString(16);
    const buffer = Buffer.from(hexTimestamp, "hex");
    let base64urlTimestamp = buffer.toString("base64");
    base64urlTimestamp = base64url.fromBase64(base64urlTimestamp);
    return config.encoding === "base64url"
      ? base64urlTimestamp
      : config.encoding == "hex"
      ? buffer.toString("hex")
      : false;
  }

  async Parse(
    base64urlTimestamp: any,
    config: { encoding: "hex" | "base64url" }
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const buffer = Buffer.from(base64urlTimestamp, config.encoding);
      const hexTimestamp = buffer.toString("hex");
      const secondsSinceEpoch = parseInt(hexTimestamp, 16);
      const epoch = Number(process.env.EPOCH_TIMESTAMP);
      const currentTimestamp = epoch + secondsSinceEpoch;
      resolve(currentTimestamp);
    });
  }
}
