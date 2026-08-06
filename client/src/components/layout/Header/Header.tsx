import { FaPlus, FaBars } from "react-icons/fa";

import { useAppDispatch } from "@store/reduxHooks";
import { openTaskForm } from "@store/features/ui/uiSlice";

import "./Header.scss";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const dispatch = useAppDispatch();

  const handleCreateTask = () => {
    dispatch(openTaskForm({ editingTaskId: null }));
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-menu-button"
          onClick={onMenuClick}
          aria-label="Открыть меню"
        >
          <FaBars />
        </button>
      </div>

      <div className="header-right">
        <button className="header-create-button" onClick={handleCreateTask}>
          <FaPlus /> Создать задачу
        </button>
      </div>
    </header>
  );
};

export default Header;
