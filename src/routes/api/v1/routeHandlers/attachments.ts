import auth from "@middleware/api/auth";
import { Router } from "express";
import * as path from "path";

const router = Router();

router.post("/", auth, (req: any, res: any) => {
  const { attachment } = req.body;
  if (!attachment)
    return res.json({
      status: 400,
      error: "Attachment Name is missing or invalid.",
    });
  const filePath = path.join(__dirname, "../../../../../uploads", attachment);

  res.sendFile(filePath);
});

export default router;
