import { ReactNode } from "react";

type Variant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "default";

type BadgeProps = {
  children: ReactNode;
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
  default: "bg-slate-100 text-slate-700",
};

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}