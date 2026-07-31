import { Router } from "express";

import { getStatistics } from "@controllers/statisticsController";

const statisticsRoutes = Router();

statisticsRoutes.get("/statistics", getStatistics);

export default statisticsRoutes;
