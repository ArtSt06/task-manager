import { NavLink } from "react-router-dom";

import { useAuth } from "@contexts/AuthContext";

import { FaTasks, FaChartBar, FaCog } from "react-icons/fa";

import "./Sidebar.scss";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose?.();
  };

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <h1>Task Manager</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          end
          onClick={handleLinkClick}
        >
          <FaTasks /> Задачи
        </NavLink>

        <NavLink
          to="/statistics"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={handleLinkClick}
        >
          <FaChartBar /> Статистика
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={handleLinkClick}
        >
          <FaCog /> Настройки
        </NavLink>
      </nav>

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
