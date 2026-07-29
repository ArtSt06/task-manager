import { NavLink } from "react-router-dom";
import { FaTasks, FaChartBar, FaCog, FaPlus } from "react-icons/fa";

import "./Sidebar.scss";

interface SidebarProps {
  onCreateTask: () => void;
}

const Sidebar = ({ onCreateTask }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Task Manager</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          end
        >
          <FaTasks /> Задачи
        </NavLink>

        <NavLink
          to="/statistics"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <FaChartBar /> Статистика
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <FaCog /> Настройки
        </NavLink>
      </nav>

      <button className="sidebar-create-btn" onClick={onCreateTask}>
        <FaPlus /> Создать задачу
      </button>
    </aside>
  );
};

export default Sidebar;
