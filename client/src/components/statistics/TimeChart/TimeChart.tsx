import type { StatisticsPeriod } from "@shared/types";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "dayjs/locale/ru";

import { formatChartDate, formatChartLabel } from "@utils/date";

import CustomTooltip from "@components/statistics/CustomTooltip";
import Loader from "@components/common/Loader";

import {
  AXIS_TICK_STYLE,
  AXIS_STROKE_STYLE,
  CREATED_LINE,
  COMPLETED_LINE,
} from "@constants/chartsConfig";

import "./TimeChart.scss";

dayjs.extend(weekOfYear);
dayjs.locale("ru");

interface TimeChartProps {
  data: { date: string; created: number; completed: number }[];
  period: StatisticsPeriod;
  onPeriodChange: (period: StatisticsPeriod) => void;
  loading?: boolean;
}

const groupByWeek = (
  data: { date: string; created: number; completed: number }[],
) => {
  const weeks: Record<
    string,
    { date: string; created: number; completed: number }
  > = {};

  data.forEach((point) => {
    const weekStart = dayjs(point.date).startOf("week").format("YYYY-MM-DD");

    if (!weeks[weekStart]) {
      weeks[weekStart] = { date: weekStart, created: 0, completed: 0 };
    }

    weeks[weekStart].created += point.created;
    weeks[weekStart].completed += point.completed;
  });

  return Object.values(weeks);
};

const TimeChart = ({
  data,
  period,
  onPeriodChange,
  loading = false,
}: TimeChartProps) => {
  let chartData = data;

  if (period === "month") {
    chartData = groupByWeek(data);
  }

  return (
    <div className="time-chart">
      <div className="chart-header">
        <h3 className="chart-title">Динамика задач</h3>

        <div className="period-toggle">
          <button
            className={period === "week" ? "active" : ""}
            onClick={() => onPeriodChange("week")}
          >
            Неделя
          </button>

          <button
            className={period === "month" ? "active" : ""}
            onClick={() => onPeriodChange("month")}
          >
            Месяц
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
        {loading ? (
          <Loader />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid className="chart-grid" />
              <XAxis
                className="chart-grid"
                dataKey="date"
                tickFormatter={(dateStr) => formatChartDate(dateStr)}
                tick={AXIS_TICK_STYLE}
                tickMargin={8}
                {...AXIS_STROKE_STYLE}
              />
              <YAxis
                className="chart-grid"
                tick={AXIS_TICK_STYLE}
                tickSize={12}
                tickMargin={6}
                {...AXIS_STROKE_STYLE}
              />
              <Tooltip
                content={<CustomTooltip />}
                labelFormatter={(label) => formatChartLabel(label, period)}
                formatter={(value, name) => [
                  value,
                  name === "created" ? "Создано" : "Выполнено",
                ]}
              />
              <Legend
                formatter={(value) =>
                  value === "created" ? "Создано" : "Выполнено"
                }
                wrapperStyle={{ color: "var(--text-secondary)" }}
              />
              <Line type="linear" dataKey="created" {...CREATED_LINE} />
              <Line type="linear" dataKey="completed" {...COMPLETED_LINE} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TimeChart;
