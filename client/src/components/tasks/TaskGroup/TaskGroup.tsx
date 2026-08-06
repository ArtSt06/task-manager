import type { Task } from "@shared/types";

import TaskItem from "@components/tasks/TaskItem";

import "./TaskGroup.scss";

interface TaskGroupProps {
  dateKey: string;
  displayDate: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete?: (id: string, title: string) => void;
  onToggleStatus?: (id: string, newStatus: Task["status"]) => void;
}

const TaskGroup = ({
  dateKey,
  displayDate,
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskGroupProps) => {
  return (
    <div className="task-group" data-group-date={dateKey}>
      <div className="task-group-header">
        <h3>{displayDate}</h3>

        <span className="task-count">Задач: {tasks.length}</span>
      </div>

      <div className="task-group-items">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskGroup;
