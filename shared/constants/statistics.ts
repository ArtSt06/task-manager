import type { StatisticsPeriod } from "@shared/types/statistics.types";

export const STATISTICS_PERIODS: StatisticsPeriod[] = ["week", "month"];

export const STATISTICS_PERIOD_LABELS: Record<StatisticsPeriod, string> = {
  week: "Неделя",
  month: "Месяц",
};
