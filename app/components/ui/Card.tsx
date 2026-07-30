import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl
        bg-white
        shadow-md
        border
        border-slate-200
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}