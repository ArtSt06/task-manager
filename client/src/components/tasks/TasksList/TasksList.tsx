import type { Task } from "@shared/types";

import TaskItem from "@components/tasks/TaskItem";

import "./TasksList.scss";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onUpdate: () => void;
}

const TasksList = ({ tasks, onEdit, onUpdate }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>📭 Задач пока нет</p>

        <span>
          Создайте первую задачу, нажав кнопку «Создать задачу» в сайдбаре
        </span>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TasksList;
