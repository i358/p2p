import { Router } from "express";
import apiAuthMiddleware from "@middleware/api/auth";
import userCheck from "@hooks/api/userCheck";
import { RedisManager } from "@lib/db/RedisManager";
import { PostgresManager } from "@lib/db/PostgresManager";

const Redis = new RedisManager();
const router = Router();
const Postgres = new PostgresManager.Postgres();

let { Get, Exists } = Redis;

router.post("/", apiAuthMiddleware, async (req: any, res: any) => {
  let { authorization } = req.headers;
  userCheck(authorization.split(" ")[1])
    .then((uck_: any) => {
      Postgres.FindOne({
        table: "users",
        keys: ["id"],
        values: [uck_.id],
      }).then((user: any) => {
        let perms: any = [];
        let [_, cperms, uperms, mperms, aperms] = user.permLevels.split(",");
        if (user && user.id) {
          let user_ = {
            id: user.id,
            username: user.username,
            color: user.color,
            email: user.email,
            createdAt: user.createdAt,
            perms,
          };
          res.json(user_);
        } else
          res.json({
            error: "User not found matching this token or token is invalid.",
          });
      });
    })
    .catch((error) =>
      res.json({
        error,
      })
    );
});

router.post("/all", apiAuthMiddleware, async (req: any, res: any) => {
  try {
    let users = await Postgres.Find({
      table: "users",
      pick: ["id", "username", "color", "createdAt"],
    });

    let exists = await Exists("online");
    if (!exists) {
      return res.json({ online: [], offline: users.rows });
    }

    let onlineUsers_: string[] = [];
    let onlineUsers: any = await Get("online");
    onlineUsers_ = JSON.parse(onlineUsers);

    const fetchUserPromises = onlineUsers_.map(async (id: any) => {
      try {
        const usr = await Postgres.FindOne({
          table: "users",
          keys: ["id"],
          values: [id],
          pick: ["id", "username", "color", "createdAt"]
        });
        return usr;
      } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        return null; 
      }
    });

    let ouList = (await Promise.all(fetchUserPromises)).filter((usr: any) => usr !== null);

    res.send({
      online: ouList,
      offline: users.rows.filter((u: any) => !ouList.some((onlineUser: any) => onlineUser.id === u.id))
    });

  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
export default router;
