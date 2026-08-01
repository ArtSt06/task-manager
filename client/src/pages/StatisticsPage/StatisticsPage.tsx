import type { StatisticsPeriod } from "@shared/types";

import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { useStatistics } from "@hooks/useStatistics";
import { fetchTasks } from "@store/features/tasks/tasksSlice";
import { selectAllTasks } from "@store/features/tasks/tasksSelectors";

import Loader from "@components/common/Loader";
import TimeChart from "@components/statistics/TimeChart";
import StatusChart from "@components/statistics/StatusChart";
import PriorityChart from "@components/statistics/PriorityChart";
import RecentActivity from "@components/statistics/RecentActivity";

import "./StatisticsPage.scss";

const StatisticsPage = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const [period, setPeriod] = useState<StatisticsPeriod>("week");
  const { data, loading, error } = useStatistics(period);

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks({}));
    }
  }, [dispatch, tasks.length]);

  if (!data && loading)
    return <Loader fullPage text="Загрузка статистики..." />;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!data) return <Loader fullPage text="Загрузка статистики..." />;

  return (
    <div className="statistics-page">
      <h2>Статистика задач</h2>

      <div className="charts-grid">
        <div className="top-row">
          <div className="summary-block">
            <RecentActivity />
          </div>

          <div className="time-chart-wrapper">
            <TimeChart
              data={data.timeline}
              period={period}
              onPeriodChange={setPeriod}
              loading={loading}
            />
          </div>
        </div>

        <div className="charts-row">
          <StatusChart data={data.statusDistribution} />

          <PriorityChart data={data.priorityDistribution} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
