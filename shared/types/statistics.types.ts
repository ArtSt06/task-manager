import type { Priority, Status } from "./task.types";

export type StatisticsPeriod = "week" | "month";

export type StatusDistribution = Record<Status, number>;

export type PriorityDistribution = Record<Priority, number>;

export interface TimelinePoint {
  date: string;
  created: number;
  completed: number;
}

export interface StatisticsResponse {
  statusDistribution: StatusDistribution;
  priorityDistribution: PriorityDistribution;
  timeline: TimelinePoint[];
}
