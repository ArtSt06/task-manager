import { Router } from "express";

import { getStatistics } from "@controllers/statisticsController";
import { authenticate } from "@middleware/auth";
import { requireAuth } from "@middleware/requireAuth";

const statisticsRoutes = Router();

statisticsRoutes.get("/statistics", authenticate, requireAuth, getStatistics);

export default statisticsRoutes;
