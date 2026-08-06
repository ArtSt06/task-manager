import type { PriorityDistribution } from "@shared/types";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
  type BarShapeProps,
} from "recharts";

import CustomTooltip from "@components/statistics/CustomTooltip";

import { PRIORITY_LABELS } from "@shared/constants";
import {
  CHART_COLORS,
  AXIS_TICK_STYLE,
  AXIS_STROKE_STYLE,
  TOOLTIP_CURSOR,
} from "@constants/chartsConfig";

import "./PriorityChart.scss";

interface PriorityChartProps {
  data: PriorityDistribution;
}

const CustomBar = (props: BarShapeProps) => {
  const { x, y, width, height, payload } = props;
  const fillColor = payload?.fill || CHART_COLORS.TOOLTIP.DEFAULT;

  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fillColor}
      stroke={fillColor}
      strokeWidth={2}
      radius={[4, 4, 0, 0]}
    />
  );
};

const PriorityChart = ({ data }: PriorityChartProps) => {
  const chartData = Object.entries(data).map(([key, value], index) => ({
    name: PRIORITY_LABELS[key as keyof typeof PRIORITY_LABELS] || key,
    value,
    fill: CHART_COLORS.PRIORITY[index] || CHART_COLORS.PRIORITY[0],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const maxValue = chartData.reduce(
    (max, item) => Math.max(max, item.value),
    0,
  );
  const yMax = maxValue > 0 ? Math.ceil(maxValue / 2) * 2 : 2;

  return (
    <div className="priority-chart">
      <div className="chart-header">
        <h3 className="chart-title">Распределение по приоритетам</h3>

        <span className="chart-subtitle">за всё время</span>
      </div>

      {total === 0 ? (
        <div className="chart-wrapper empty">
          <div className="empty-message">Нет данных для отображения</div>
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid className="chart-grid" />

              <XAxis
                dataKey="name"
                tick={AXIS_TICK_STYLE}
                {...AXIS_STROKE_STYLE}
              />

              <YAxis
                tick={AXIS_TICK_STYLE}
                {...AXIS_STROKE_STYLE}
                domain={[0, yMax]}
                allowDecimals={false}
              />

              <Tooltip
                content={<CustomTooltip />}
                labelFormatter={() => ""}
                formatter={(value) => [value, "Задач"]}
                cursor={TOOLTIP_CURSOR}
              />

              <Bar dataKey="value" shape={CustomBar} />
            </BarChart>
          </ResponsiveContainer>

          <div className="chart-footer">
            <span>
              Всего задач выполнено: <strong>{total}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityChart;
