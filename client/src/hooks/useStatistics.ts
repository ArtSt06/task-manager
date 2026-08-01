import type { StatisticsPeriod } from "@shared/types";

import { useEffect, useCallback } from "react";

import { useAction } from "@hooks/useAction";
import { getStatistics } from "@api/statistics";

export const useStatistics = (period: StatisticsPeriod) => {
  const fetchStatistics = useCallback(() => getStatistics(period), [period]);

  const { execute, loading, error, data } = useAction(fetchStatistics);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};
