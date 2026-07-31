import { Request, Response } from "express";

import { cache } from "@utils/cache";

import Task from "@models/TaskModel";

import type {
  StatusDistribution,
  PriorityDistribution,
  StatisticsResponse,
  StatisticsPeriod,
} from "@shared/types";

const getStatusDistribution = async (): Promise<StatusDistribution> => {
  const result = await Task.aggregate([
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

const getPriorityDistribution = async (): Promise<PriorityDistribution> => {
  const result = await Task.aggregate([
    { $match: { status: "done" } },
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

const getTimeline = async (period: StatisticsPeriod) => {
  const now = new Date();
  let startDate: Date;

  if (period === "week") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
  } else {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 29);
  }

  const result = await Task.aggregate([
    {
      $match: {
        $or: [
          { createdAt: { $gte: startDate } },
          { updatedAt: { $gte: startDate } },
        ],
      },
    },
    {
      $project: {
        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        status: 1,
      },
    },
    {
      $group: {
        _id: "$date",
        created: { $sum: 1 },
        completed: {
          $sum: {
            $cond: [{ $eq: ["$status", "done"] }, 1, 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const timeline = [];
  const currentDate = new Date(startDate);
  const endDate = new Date(now);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const found = result.find((item) => item._id === dateStr);
    timeline.push({
      date: dateStr,
      created: found ? found.created : 0,
      completed: found ? found.completed : 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return timeline;
};

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const period = (req.query.period as StatisticsPeriod) || "week";
    const cacheKey = `statistics-${period}`;

    const cachedData = cache.get<StatisticsResponse>(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const [statusDistribution, priorityDistribution, timeline] =
      await Promise.all([
        getStatusDistribution(),
        getPriorityDistribution(),
        getTimeline(period),
      ]);

    const responseData: StatisticsResponse = {
      statusDistribution,
      priorityDistribution,
      timeline,
    };

    cache.set(cacheKey, responseData);
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении статистики" });
  }
};
