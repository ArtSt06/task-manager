export const CHART_COLORS = {
  PRIORITY: [
    "rgba(34, 197, 94, 1)",
    "rgba(245, 158, 11, 1)",
    "rgba(239, 68, 68, 1)",
  ],
  STATUS: [
    "rgba(148, 163, 184, 1)",
    "rgba(59, 130, 246, 1)",
    "rgba(34, 197, 94, 1)",
  ],
  LINES: {
    CREATED: "rgba(59, 130, 246, 1)",
    COMPLETED: "rgba(34, 197, 94, 1)",
  },
  TOOLTIP: {
    DEFAULT: "rgba(136, 132, 216, 1)",
    CURSOR: "rgba(59,130,246,0.08)",
  },
};

export const AXIS_TICK_STYLE = {
  fill: "var(--text-secondary)",
  fontSize: 12,
};

export const AXIS_STROKE_STYLE = {
  stroke: "var(--border-color)",
};

export const DEFAULT_LINE = {
  fill: null,
  strokeWidth: 2,
  dot: { r: 4 },
  activeDot: { r: 6 },
};

export const CREATED_LINE = {
  ...DEFAULT_LINE,
  stroke: CHART_COLORS.LINES.CREATED,
  dot: { ...DEFAULT_LINE.dot, fill: CHART_COLORS.LINES.CREATED },
};

export const COMPLETED_LINE = {
  ...DEFAULT_LINE,
  stroke: CHART_COLORS.LINES.COMPLETED,
  dot: { ...DEFAULT_LINE.dot, fill: CHART_COLORS.LINES.COMPLETED },
};

export const TOOLTIP_CURSOR = {
  fill: CHART_COLORS.TOOLTIP.CURSOR,
};
