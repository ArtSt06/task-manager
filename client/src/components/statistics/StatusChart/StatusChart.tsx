import type { StatusDistribution } from "@shared/types";

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

import CustomTooltip from "@components/statistics/CustomTooltip";

import { STATUS_LABELS } from "@shared/constants";
import { CHART_COLORS } from "@constants/chartsConfig";

import "./StatusChart.scss";

interface StatusChartProps {
  data: StatusDistribution;
}

const StatusChart = ({ data }: StatusChartProps) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const chartData = Object.entries(data).map(([key, value], index) => ({
    name: STATUS_LABELS[key as keyof typeof STATUS_LABELS] || key,
    value,
    fill: CHART_COLORS.STATUS[index] || CHART_COLORS.STATUS[0],
    percent: total > 0 ? Math.round((value / total) * 100) : 0,
  }));

  return (
    <div className="status-chart">
      <div className="chart-header">
        <h3 className="chart-title">Распределение по статусам</h3>

        <span className="chart-subtitle">за всё время</span>
      </div>

      {total === 0 ? (
        <div className="chart-wrapper empty">
          <div className="empty-message">Нет данных для отображения</div>
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer aspect={1 / 1} width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius="50%"
                outerRadius="100%"
                paddingAngle={0}
                cx="50%"
                cy="50%"
              />

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pie-legend">
            {chartData.map((item) => (
              <div key={item.name} className="legend-item">
                <span
                  className="legend-color"
                  style={{ background: item.fill }}
                />

                <span className="legend-label">{item.name}</span>

                <span className="legend-value">{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusChart;
