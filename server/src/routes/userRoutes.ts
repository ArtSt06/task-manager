import { Router } from "express";

import {
  getSettings,
  updateSettings,
  resetSettings,
} from "@controllers/userController";
import { authenticate } from "@middleware/auth";
import { requireAuth } from "@middleware/requireAuth";

const router = Router();

router.get("/user/settings", authenticate, requireAuth, getSettings);
router.patch("/user/settings", authenticate, requireAuth, updateSettings);
router.post("/user/settings/reset", authenticate, requireAuth, resetSettings);

export default router;
