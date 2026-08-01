import type { StatisticsResponse, StatisticsPeriod } from "@shared/types";

import { apiClient } from "@api/client";

const STATISTICS_ENDPOINT = "/statistics";

export const getStatistics = async (
  period: StatisticsPeriod = "week",
): Promise<StatisticsResponse> => {
  return apiClient.get<StatisticsResponse>(STATISTICS_ENDPOINT, { period });
};
