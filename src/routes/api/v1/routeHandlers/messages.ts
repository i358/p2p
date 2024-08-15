import { Router } from "express";
import { PostgresManager } from "@lib/db/PostgresManager";
import { SocketManager } from "@lib/ws/SocketManager";
import { Snowflake as SnowflakeInstance } from "@util/api/token/Snowflake";
import userCheck from "@hooks/api/userCheck";
import apiAuthMiddleware from "@middleware/api/auth";
import multer from "multer";
import * as path from "path";
import moment from "moment";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const snowflake = new SnowflakeInstance(3n);
    snowflake.createUUID({ encoding: "none" }).then((attachmentId) => {
      cb(null, attachmentId + path.extname(file.originalname));
    });
  },
});

const imageFilter = function (req: any, file: any, cb: any) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Sadece resim ve gif dosyaları kabul edilir!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});
const router = Router();
const Postgres = new PostgresManager.Postgres();
const SocketInstance = new SocketManager();
const Socket = SocketInstance.Instance();

router.post("/", apiAuthMiddleware, (req: any, res: any) => {
  Postgres.Find({ table: "messages" }).then((messages: any) => {
    let m: any = [];
    if (messages.rows.length < 1) {
      res.json([]);
    } else {
      messages.rows.map((message: any) => {
        Postgres.FindOne({
          table: "users",
          keys: ["id"],
          values: [message.senderId],
        }).then((sender: any) => {
          let s_;
          if (sender.id && sender.username) s_ = sender;
          else
            s_ = {
              id: 0,
              username: "Deleted User",
              color: "FFFF",
              createdAt: 0,
            };
          m.push({
            id: Number(message.id),
            createdAt: Number(message.createdAt),
            sender: {
              id: Number(s_.id),
              username: s_.username,
              color: s_.color,
              createdAt: Number(s_.createdAt),
            },
            content: message.content,
            attachments: JSON.parse(message.attachments),
          });
          if (m.length === messages.rows.length) send();
        });
      });
      const send = () => {
        res.json(m);
      };
    }
  });
});
router.post(
  "/send",
  apiAuthMiddleware,
  upload.array("images"),
  async (req: any, res: any) => {
    let { authorization } = req.headers;
    userCheck(authorization.split(" ")[1])
      .then((uid: any) => {
        Postgres.FindOne({
          table: "users",
          keys: ["id"],
          values: [uid.id],
        }).then(async (user: any) => {
          let { message } = req.body;
          message = JSON.parse(message);
          if (!message || !message.content)
            res.json({
              error: "Message or message properties is missing.",
              status: { code: 11, description: "MISSING_FORM_MEMBER" },
            });
          else {
            const Snowflake = new SnowflakeInstance(2n);
            let mid_ = await Snowflake.createUUID({ encoding: "none" });
            let dateNow = moment().valueOf();
            let m = {
              id: mid_,
              sender: {
                username: user.username,
                id: user.id,
                color: user.color,
              },
              content: message.content,
              createdAt: dateNow,
              token: message.token,
              attachments: [],
              isSent: true,
            };
            function handleUpload(req: any, res: any, next: any) {
              let attachmentIds: any = [];
              if (req.files && req.files.length > 0) {
                req.files.forEach((file: any) => {
                  const [id, ext] = file.filename.split(".");
                  attachmentIds.push(id + "." + ext);
                });
                next(attachmentIds);
              }
            }
            const save = (attachmentIds?: any) => {
              m.attachments = attachmentIds || [];
              Postgres.Create({
                table: "messages",
                keys: ["id", "senderId", "content", "createdAt", "attachments"],
                values: [
                  mid_,
                  user.id,
                  message.content,
                  dateNow,
                  JSON.stringify(m.attachments),
                ],
              }).then(() => {
                Socket.emit("send", { to: "message" }, m);
                res.json(m);
              });
            };
            if (req.files && req.files.length > 0) {
              handleUpload(req, res, function (attachmentIds: any) {
                save(attachmentIds);
              });
            } else if (message.content) {
              save([]);
            }
          }
        });
      })
      .catch((e) => res.json({ error: e }));
  }
);

export default router;
