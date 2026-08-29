import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Hand, BarChart3, Menu, X, NotebookPen, ListChecks, Target, Trophy, BookOpen, Settings } from "lucide-react";

const moreItems = [
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--border)] pb-[env(safe-area-inset-bottom)]"
        aria-label="Primary"
      >
        <ul className="flex items-stretch justify-between px-2">
          <NavItem to="/dashboard" label="Home" icon={LayoutDashboard} />
          <NavItem to="/calendar" label="Calendar" icon={Calendar} />
          <li className="flex-1 flex items-center justify-center -mt-5">
            <button
              onClick={() => navigate("/urge-mode")}
              aria-label="I'm having an urge"
              className="focus-ring w-14 h-14 rounded-full bg-[var(--primary)] text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Hand size={22} />
            </button>
          </li>
          <NavItem to="/insights" label="Insights" icon={BarChart3} />
          <li className="flex-1">
            <button
              onClick={() => setOpen(true)}
              className="focus-ring w-full flex flex-col items-center justify-center gap-1 py-2.5 text-[var(--muted)]"
            >
              <Menu size={20} />
              <span className="text-[11px] font-medium">More</span>
            </button>
          </li>
        </ul>
      </nav>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end animate-fade-in"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full bg-[var(--surface)] rounded-t-2xl border-t border-[var(--border)] p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] animate-pop">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">More</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="focus-ring p-1.5 rounded-lg text-[var(--muted)]">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-2 py-4 rounded-xl bg-[var(--surface-2)] text-[var(--text)] text-xs font-medium"
                >
                  <Icon size={20} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  return (
    <li className="flex-1">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `focus-ring w-full flex flex-col items-center justify-center gap-1 py-2.5 ${
            isActive ? "text-[var(--primary)]" : "text-[var(--muted)]"
          }`
        }
      >
        <Icon size={20} />
        <span className="text-[11px] font-medium">{label}</span>
      </NavLink>
    </li>
  );
}
