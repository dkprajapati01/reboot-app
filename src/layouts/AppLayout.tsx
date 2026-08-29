import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import TopBar from "../components/TopBar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
