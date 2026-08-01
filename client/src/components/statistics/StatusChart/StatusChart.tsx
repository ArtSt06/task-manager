import type { StatusDistribution } from "@shared/types";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

import CustomTooltip from "@components/statistics/CustomTooltip";

import { STATUS_LABELS } from "@shared/constants";

import "./StatusChart.scss";

interface StatusChartProps {
  data: StatusDistribution;
}

const COLORS = ["#94a3b8", "#3b82f6", "#22c55e"];

const StatusChart = ({ data }: StatusChartProps) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const chartData = Object.entries(data).map(([key, value]) => ({
    name: STATUS_LABELS[key as keyof typeof STATUS_LABELS] || key,
    value,
    color: COLORS[Object.keys(data).indexOf(key)],
    percent: total > 0 ? Math.round((value / total) * 100) : 0,
  }));

  return (
    <div className="chart-container status-chart">
      <div className="chart-header">
        <h3>Распределение по статусам</h3>

        <span className="chart-subtitle">за всё время</span>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              cx="50%"
              cy="50%"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value) => [value, "задач"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="pie-legend">
        {chartData.map((item) => (
          <div key={item.name} className="legend-item">
            <span className="legend-color" style={{ background: item.color }} />

            <span className="legend-label">{item.name}</span>

            <span className="legend-value">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
