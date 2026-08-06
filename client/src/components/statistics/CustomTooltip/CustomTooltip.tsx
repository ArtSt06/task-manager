import { CHART_COLORS } from "@constants/chartsConfig";

import "./CustomTooltip.scss";

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    fill?: string;
    stroke?: string;
    payload?: {
      fill?: string;
      stroke?: string;
    };
  }[];
  label?: string;
  labelFormatter?: (label: string) => string;
  formatter?: (value: number, name: string) => [number, string];
}

const CustomTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const formattedLabel = labelFormatter ? labelFormatter(String(label)) : label;

  return (
    <div className="custom-tooltip">
      {formattedLabel && (
        <p className="custom-tooltip-label">{formattedLabel}</p>
      )}

      {payload.map((entry, index) => {
        const [value, name] = formatter
          ? formatter(entry.value, entry.name)
          : [entry.value, entry.name];

        const color =
          entry.fill ||
          entry.payload?.fill ||
          entry.stroke ||
          entry.payload?.stroke ||
          CHART_COLORS.TOOLTIP.DEFAULT;

        return (
          <p key={index} className="custom-tooltip-item" style={{ color }}>
            <span
              className="custom-tooltip-dot"
              style={{ backgroundColor: color }}
            />
            {name}: {value}
          </p>
        );
      })}
    </div>
  );
};

export default CustomTooltip;
