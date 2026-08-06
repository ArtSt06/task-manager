import { Outlet } from "react-router-dom";
import { Suspense, useState } from "react";

import Sidebar from "@components/layout/Sidebar";
import Header from "@components/layout/Header";
import Loader from "@components/common/Loader";

import "./AppLayout.scss";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <div className="app-main">
        <Header onMenuClick={toggleSidebar} />

        <main className="app-content">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <aside className="right-border"></aside>
    </div>
  );
};

export default AppLayout;
