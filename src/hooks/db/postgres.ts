import log from "@util/log";
import moment from "moment";
import colors from "colors";
import { Crypter } from "@lib/security/crypter";
import pgHealthCheck from "@util/db/pgHealthCheck";
import pg from "pg";
import { PostgresManager } from "@lib/db/PostgresManager";

export function Client(): Promise<any> {
  return new Promise((resolve, reject) => {
    log("{ring} Initializing PostgreSQL Client...", colors.dim);

    const Postgres = new PostgresManager.Postgres();
    Postgres.Connect()
      .then((client: any) => {
        log(
          "{ready} PostgreSQL Client successfully initialized, checking for cluster health..",
          colors.yellow
        );
        pgHealthCheck()
          .then(() => {
            log(
              `{online} ${colors.bgGreen("OK! Cluster is working properly.")}`,
              colors.bold
            );
            resolve(client);
          })
          .catch((err) => log("{error} " + err, colors.red));
      })
      .catch((err: any) => {
        log(
          "{error} An error occurred while initializing PostgreSQL Client: " +
            err,
          colors.red
        );
        reject(false);
      });
  });
}
