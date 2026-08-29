import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[var(--primary)] text-black hover:brightness-110 active:brightness-95",
  secondary: "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border)]",
  outline: "bg-transparent border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]",
  ghost: "bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
  danger: "bg-[var(--red)] text-white hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3.5 gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
