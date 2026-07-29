import { useState, useEffect } from 'react';
import { useTasks } from '@hooks/useTasks';
import { useTasksContext } from '../../contexts/TasksContext';
import TasksList from '@components/tasks/TasksList';
import TaskFormModal from '@components/tasks/TaskFormModal';
import Loader from '@components/common/Loader';
import type { Task } from '@shared/types';
import './TasksPage.scss';

const TasksPage = () => {
  const { setRefreshFunction } = useTasksContext();
  const [filters] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, loading, error, refetch } = useTasks(filters);

  useEffect(() => {
    setRefreshFunction(refetch);
  }, [setRefreshFunction, refetch]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSuccess = () => {
    refetch();
  };

  if (loading) {
    return <Loader fullPage text="Загрузка задач..." />;
  }

  if (error) {
    return <div className="error">❌ Ошибка: {error}</div>;
  }

  return (
    <div className="tasks-page">
      <h2>📋 Список задач</h2>
      <TasksList tasks={tasks} onEdit={handleEdit} onUpdate={refetch} />

      <TaskFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
        initialData={editingTask}
      />
    </div>
  );
};

export default TasksPage;