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

import CustomTooltip from "@components/statistics/CustomTooltip";

import "./TimeChart.scss";

dayjs.extend(weekOfYear);
dayjs.locale("ru");

interface TimeChartProps {
  data: { date: string; created: number; completed: number }[];
  period: StatisticsPeriod;
  onPeriodChange: (period: StatisticsPeriod) => void;
  loading?: boolean;
}

const axisTickStyle = { fill: "var(--text-secondary)", fontSize: 12 };
const gridStyle = { stroke: "var(--border-color)" };
const legendStyle = { color: "var(--text-secondary)" };

const createdLineConfig = {
  stroke: "#3b82f6",
  strokeWidth: 2,
  dot: { r: 4, fill: "#3b82f6" },
  activeDot: { r: 6 },
};

const completedLineConfig = {
  stroke: "#22c55e",
  strokeWidth: 2,
  dot: { r: 4, fill: "#22c55e" },
  activeDot: { r: 6 },
};

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

  const formatDate = (dateStr: string) => {
    if (period === "week") {
      return dayjs(dateStr).format("DD.MM");
    } else {
      const start = dayjs(dateStr);
      const end = start.add(6, "day");
      return `${start.format("DD.MM")} – ${end.format("DD.MM")}`;
    }
  };

  return (
    <div className="chart-container time-chart">
      <div className="chart-header">
        <h3>Динамика задач</h3>

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
        {loading && (
          <div className="chart-loading-overlay">
            <span>Обновление...</span>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={axisTickStyle}
              {...gridStyle}
            />
            <YAxis tick={axisTickStyle} {...gridStyle} />
            <Tooltip
              content={<CustomTooltip />}
              labelFormatter={(label) => {
                const dateStr = String(label);
                if (period === "week") {
                  return dayjs(dateStr).format("DD MMM YYYY");
                } else {
                  const start = dayjs(dateStr);
                  const end = start.add(6, "day");
                  return `Неделя ${start.format("DD MMM")} – ${end.format("DD MMM")}`;
                }
              }}
              formatter={(value, name) => [
                value,
                name === "created" ? "Создано" : "Выполнено",
              ]}
            />
            <Legend
              formatter={(value) =>
                value === "created" ? "Создано" : "Выполнено"
              }
              wrapperStyle={legendStyle}
            />
            <Line type="linear" dataKey="created" {...createdLineConfig} />
            <Line type="linear" dataKey="completed" {...completedLineConfig} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeChart;
