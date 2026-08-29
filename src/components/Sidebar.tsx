import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Hand,
  BarChart3,
  NotebookPen,
  ListChecks,
  Target,
  Trophy,
  BookOpen,
  Settings,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/urge-mode", label: "Urge Mode", icon: Hand, highlight: true },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/resources", label: "Resources", icon: BookOpen },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[var(--border)] bg-[var(--bg)]">
      <div className="flex items-center gap-2.5 px-6 h-16 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <ShieldCheck size={18} className="text-black" />
        </div>
        <span className="font-semibold tracking-tight text-lg">REBOOT</span>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Primary">
        <ul className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, highlight }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `focus-ring group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? highlight
                        ? "bg-[var(--primary)] text-black"
                        : "bg-[var(--surface-2)] text-[var(--text)]"
                      : highlight
                      ? "text-[var(--primary)] hover:bg-[var(--primary-soft)]"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-[var(--border)]">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `focus-ring flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive ? "bg-[var(--surface-2)] text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
