import { Response } from "express";

import { AuthRequest } from "@middleware/auth";
import { cache } from "@utils/cache";

import Task from "@models/TaskModel";

import type {
  StatusDistribution,
  PriorityDistribution,
  StatisticsResponse,
  StatisticsPeriod,
} from "@shared/types";

const getStatusDistribution = async (
  firebaseUid: string,
): Promise<StatusDistribution> => {
  const result = await Task.aggregate([
    { $match: { firebaseUid } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const distribution: StatusDistribution = {
    todo: 0,
    inProgress: 0,
    done: 0,
  };

  result.forEach((item) => {
    const key = item._id as keyof StatusDistribution;
    if (key in distribution) {
      distribution[key] = item.count;
    }
  });

  return distribution;
};

const getPriorityDistribution = async (
  firebaseUid: string,
): Promise<PriorityDistribution> => {
  const result = await Task.aggregate([
    { $match: { firebaseUid, status: "done" } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);

  const distribution: PriorityDistribution = {
    low: 0,
    medium: 0,
    high: 0,
  };

  result.forEach((item) => {
    const key = item._id as keyof PriorityDistribution;
    if (key in distribution) {
      distribution[key] = item.count;
    }
  });

  return distribution;
};

const getCreatedTimeline = async (firebaseUid: string, startDate: Date) => {
  const result = await Task.aggregate([
    { $match: { firebaseUid, createdAt: { $gte: startDate } } },
    {
      $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      },
    },
    { $group: { _id: "$date", created: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const map: Record<string, number> = {};
  result.forEach((item) => {
    map[item._id] = item.created;
  });
  return map;
};

const getCompletedTimeline = async (firebaseUid: string, startDate: Date) => {
  const result = await Task.aggregate([
    { $match: { firebaseUid, status: "done", updatedAt: { $gte: startDate } } },
    {
      $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
      },
    },
    { $group: { _id: "$date", completed: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const map: Record<string, number> = {};
  result.forEach((item) => {
    map[item._id] = item.completed;
  });
  return map;
};

const getTimeline = async (firebaseUid: string, period: StatisticsPeriod) => {
  const now = new Date();
  let startDate: Date;
  const days = period === "week" ? 6 : 29;
  startDate = new Date(now);
  startDate.setDate(now.getDate() - days);

  const [createdMap, completedMap] = await Promise.all([
    getCreatedTimeline(firebaseUid, startDate),
    getCompletedTimeline(firebaseUid, startDate),
  ]);

  const timeline = [];
  const currentDate = new Date(startDate);
  const endDate = new Date(now);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    timeline.push({
      date: dateStr,
      created: createdMap[dateStr] || 0,
      completed: completedMap[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return timeline;
};

export const getStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const firebaseUid = req.user!.uid;

    const period = (req.query.period as StatisticsPeriod) || "week";
    const cacheKey = `statistics-${period}-${firebaseUid}`;

    const cachedData = cache.get<StatisticsResponse>(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const [statusDistribution, priorityDistribution, timeline] =
      await Promise.all([
        getStatusDistribution(firebaseUid),
        getPriorityDistribution(firebaseUid),
        getTimeline(firebaseUid, period),
      ]);

    const responseData: StatisticsResponse = {
      statusDistribution,
      priorityDistribution,
      timeline,
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении статистики" });
  }
};
