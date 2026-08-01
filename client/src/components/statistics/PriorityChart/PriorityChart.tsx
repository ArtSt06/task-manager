import type { PriorityDistribution } from "@shared/types";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PRIORITY_LABELS } from "@shared/constants";

import CustomTooltip from "@components/statistics/CustomTooltip";

import "./PriorityChart.scss";

const axisTickStyle = { fill: "var(--text-secondary)", fontSize: 12 };
const axisStrokeStyle = { stroke: "var(--border-color)" };

interface PriorityChartProps {
  data: PriorityDistribution;
}

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const PriorityChart = ({ data }: PriorityChartProps) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: PRIORITY_LABELS[key as keyof typeof PRIORITY_LABELS] || key,
    value,
    color: COLORS[Object.keys(data).indexOf(key)],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-container priority-chart">
      <div className="chart-header">
        <h3>Выполненные по приоритетам</h3>

        <span className="chart-subtitle">за всё время</span>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid className="chart-grid" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={axisTickStyle}
              stroke={axisStrokeStyle.stroke}
            />
            <YAxis tick={axisTickStyle} stroke={axisStrokeStyle.stroke} />
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value) => [value, "задач"]}
            />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-footer">
        <span>
          Всего выполнено: <strong>{total}</strong> задач
        </span>
      </div>
    </div>
  );
};

export default PriorityChart;
