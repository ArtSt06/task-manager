import type { Task } from "@shared/types";

import { useAppSelector } from "@store/reduxHooks";
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
  const tasks = useAppSelector(selectAllTasks);

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
    .slice(0, 4);

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

      <ul className="activity-list">
        {activities.map((activity) => (
          <li className="task" key={activity.id}>
            <span className="task-title">{activity.title}</span>

            <div className="task-info">
              <span className={`task-badge ${activity.type}`}>
                {activity.type === "created" ? "Создана" : "Выполнена"}
              </span>

              <span className="activity-time">{formatDate(activity.date)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
