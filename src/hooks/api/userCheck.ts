import { PostgresManager } from "@lib/db/PostgresManager";
import handle from "handlers/api/bearerTokenHandler";

export default function (token: any) {
  return new Promise((resolve, reject) => {
    const Postgres = new PostgresManager.Postgres();
    handle(token)
      .then((data: any) => {
        Postgres.FindOne({ table: "users", keys: ["id"], values: [data.id] })
          .then((user: any) => {
            if (user && user.id) {
              Postgres.FindOne({
                table: "secrets",
                keys: ["secret"],
                values: [data.hmac],
              }).then((s) => {
                if (s.secret) {
                  resolve(user);
                } else {
                  reject("User not found.");
                }
              });
            } else reject("User not found.");
          })
          .catch(() => reject("User not found."));
      })
      .catch(() => reject("Invalid token."));
  });
}
