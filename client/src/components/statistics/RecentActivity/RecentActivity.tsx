import type { Task } from "@shared/types";

import { useSelector } from "react-redux";

import { selectAllTasks } from "@store/features/tasks/tasksSelectors";
import { formatDate } from "@utils/date";

import "./RecentActivity.scss";

interface Activity {
  id: string;
  title: string;
  type: "created" | "completed";
  date: string;
}

const RecentActivity = () => {
  const tasks = useSelector(selectAllTasks);

  const activities: Activity[] = tasks
    .map((task: Task) => {
      const type: "created" | "completed" =
        task.status === "done" ? "completed" : "created";
      const date = task.status === "done" ? task.updatedAt : task.createdAt;
      return {
        id: task._id,
        title: task.title,
        type,
        date,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  if (activities.length === 0) {
    return (
      <div className="recent-activity empty">
        <p>Нет активных задач</p>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <h3>Последние действия</h3>
      
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <span className="activity-title">{activity.title}</span>

            <span className={`task-badge ${activity.type}`}>
              {activity.type === "created" ? "Создана" : "Выполнена"}
            </span>

            <span className="activity-time">{formatDate(activity.date)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
