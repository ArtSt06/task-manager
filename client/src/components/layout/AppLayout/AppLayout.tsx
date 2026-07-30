import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Sidebar from "@components/layout/Sidebar";
import Header from "@components/layout/Header";
import Loader from "@components/common/Loader";

import "./AppLayout.scss";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header />

        <main className="app-content">
          <Suspense fallback={<Loader fullPage text="Загрузка страницы..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
