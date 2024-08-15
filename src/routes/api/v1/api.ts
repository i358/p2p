import { Router } from "express";
import validator from "validator";
import xml from "xml";
import usersRouter from "./routeHandlers/users";
import messagesRouter from "./routeHandlers/messages";
import attachmentsRouter from "./routeHandlers/attachments";
import sessionRouter from "./routeHandlers/session";

const router = Router();

router.get("*", (req: any, res: any) => {
  res.type("application/xml");
  res.status(403);
  let XMLError = {
    APIResponse: [
      {
        Method: req.method,
      },
      {
        Status: res.statusCode,
      },
      {
        Content: "Unauthorized. Use the POST method.",
      },
    ],
  };
  res.send(xml(XMLError, { declaration: true }));
});

router.use("/users", usersRouter);
router.use("/messages", messagesRouter);
router.use("/attachments", attachmentsRouter);
router.use("/session", sessionRouter);

export default router;
