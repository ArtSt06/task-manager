import type { StatisticsPeriod } from "@shared/types";

import dayjs from "dayjs";

import "dayjs/locale/ru";

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatChartDate = (dateStr: string): string => {
  return dayjs(dateStr).format("DD.MM");
};

export const formatChartLabel = (
  label: unknown,
  period: StatisticsPeriod,
): string => {
  const dateStr = String(label);
  if (period === "week") {
    return dayjs(dateStr).format("DD.MM.YYYY");
  } else {
    const start = dayjs(dateStr);
    const end = start.add(6, "day");
    return `Неделя ${start.format("DD.MM")} – ${end.format("DD.MM")}`;
  }
};

export const formatISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseISODate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};
