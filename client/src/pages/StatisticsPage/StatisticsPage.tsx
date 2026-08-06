import type { StatisticsPeriod } from "@shared/types";

import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { useStatistics } from "@hooks/useStatistics";
import { fetchTasks } from "@store/features/tasks/tasksSlice";
import { selectAllTasks } from "@store/features/tasks/tasksSelectors";

import Loader from "@components/common/Loader";
import ErrorDisplay from "@components/common/ErrorDisplay";
import TimeChart from "@components/statistics/TimeChart";
import StatusChart from "@components/statistics/StatusChart";
import PriorityChart from "@components/statistics/PriorityChart";
import RecentActivity from "@components/statistics/RecentActivity";

import "./StatisticsPage.scss";

const StatisticsPage = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const [period, setPeriod] = useState<StatisticsPeriod>("week");
  const { data, loading, error, refetch } = useStatistics(period);

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks({}));
    }
  }, [dispatch, tasks.length]);

  useEffect(() => {
    if (tasks.length > 0) {
      refetch();
    }
  }, [tasks.length, refetch]);

  if (error) {
    return (
      <ErrorDisplay
        title="Ошибка загрузки статистики"
        message={error}
        fullPage={true}
        onRetry={refetch}
      />
    );
  }

  if (!data) return <Loader />;

  return (
    <div className="statistics-page page">
      <h2 className="page-title">Статистика задач</h2>

      <div className="charts-grid">
        <div className="top-row">
          <div className="statistics-container">
            <RecentActivity />
          </div>

          <div className="statistics-container">
            <TimeChart
              data={data.timeline}
              period={period}
              onPeriodChange={setPeriod}
              loading={loading}
            />
          </div>
        </div>

        <div className="bottom-row">
          <div className="statistics-container">
            <StatusChart data={data.statusDistribution} />
          </div>

          <div className="statistics-container">
            <PriorityChart data={data.priorityDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
