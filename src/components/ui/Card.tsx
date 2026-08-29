import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section";
  padded?: boolean;
}

export default function Card({ padded = true, className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-soft)] ${padded ? "p-5 sm:p-6" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
