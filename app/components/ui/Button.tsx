import {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    children: ReactNode;
  };

const variants: Record<Variant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",
  secondary:
    "bg-slate-600 hover:bg-slate-700 text-white",
  success:
    "bg-green-600 hover:bg-green-700 text-white",
  warning:
    "bg-amber-500 hover:bg-amber-600 text-white",
  danger:
    "bg-red-600 hover:bg-red-700 text-white",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        inline-flex
        h-9
        items-center
        justify-center
        rounded-md
        px-3.5
        text-sm
        font-medium
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}