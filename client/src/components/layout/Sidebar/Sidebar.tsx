import { NavLink } from "react-router-dom";
import { FaTasks, FaChartBar, FaCog, FaPlus } from "react-icons/fa";

import { useAppDispatch } from "@store/reduxHooks";
import { openForm } from "@store/features/ui/uiSlice";
import { useAuth } from "@contexts/AuthContext";

import "./Sidebar.scss";

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleCreateTask = () => {
    dispatch(openForm());
  };

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

      <button className="sidebar-create-btn" onClick={handleCreateTask}>
        <FaPlus /> Создать задачу
      </button>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info">
            <span className="user-email">{user.email}</span>

            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
