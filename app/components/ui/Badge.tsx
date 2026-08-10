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
  success:
    "bg-green-50 text-green-700 ring-green-600/20",
  danger:
    "bg-red-50 text-red-700 ring-red-600/20",
  warning:
    "bg-amber-50 text-amber-700 ring-amber-600/20",
  info:
    "bg-blue-50 text-blue-700 ring-blue-600/20",
  default:
    "bg-slate-50 text-slate-700 ring-slate-600/20",
};

export default function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        whitespace-nowrap
        rounded-md
        px-2
        py-0.5
        text-[11px]
        font-semibold
        leading-5
        ring-1
        ring-inset
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}