import { Crypter } from "@lib/security/crypter";
import moment from "moment";
import log from "@util/log";
import { PostgresManager } from "@lib/db/PostgresManager";
import colors from "colors";

export default function () {
  const Postgres = new PostgresManager.Postgres();
  return new Promise<any>(async (resolve, reject) => {
    const crypter = new Crypter.AES256CBC();
    let verifyC = { ts_: moment().format("DD-MM-YYYY.HH_mm_ss") };
    let op: any = await crypter
      //@ts-ignore
      .encrypt(JSON.stringify(verifyC), {
        iv: Buffer.from(`0${moment().format("DDMMYYYYHHmmss")}0`),
      })
      .catch(reject);
    log("{ring} Initializing cluster health check...", colors.dim);
    Postgres.Create({
      table: "logs",
      keys: [
        "type",
        "message",
        "readChannel",
        "verifyChannel",
        "createdAt",
        "cache",
      ],
      values: [
        "SystemHealthCheck",
        "PostgreSQL Client initialized, checked cluster health.",
        op.secret.key,
        op.secret.iv,
        moment().format("YYYY-MM-DD HH:mm:ss"),
        op.hash,
      ],
    })
      .then(() => {
        Postgres.FindOne({
          table: "logs",
          keys: ["readChannel", "verifyChannel", "cache"],
          values: [op.secret.key, op.secret.iv, op.hash],
        })
          .then(async (row: any) => {
            if (row && row.cache) {
              let ec: any = await crypter
                .decrypt(row.cache, {
                  iv: row.verifyChannel,
                  key: row.readChannel,
                })
                .catch(reject);
              if (ec && ec.ts_) {
                /*const del = () => {
                  client.query(`DELETE FROM "logs" WHERE "readChannel"=$1 AND "verifyChannel"=$2 AND "cache"=$3`, [op.secret.key, op.secret.iv, op.hash])
                }*/
                if (ec.ts_ === verifyC.ts_) {
                  resolve(true);
                  //del();
                } else {
                  reject("Cluster isn't working properly.");
                  //del();
                }
              }
            }
          })
          .catch((err: any) => reject("Postgres query error => " + err));
      })
      .catch((err: any) => reject("Cluster error => " + err));
  });
}
