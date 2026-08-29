import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

type ToastKind = "success" | "info" | "warning";
interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-[var(--primary)]" />,
  info: <Info size={18} className="text-[var(--blue)]" />,
  warning: <AlertTriangle size={18} className="text-[var(--amber)]" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center w-full px-4 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-pop pointer-events-auto flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-sm px-4 py-2.5 rounded-xl shadow-[var(--shadow-soft)]"
          >
            {icons[t.kind]}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
