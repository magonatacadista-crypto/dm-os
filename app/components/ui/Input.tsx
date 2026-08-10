import {
  forwardRef,
  InputHTMLAttributes,
} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            h-9
            w-full
            rounded-md
            border
            bg-white
            px-3
            text-sm
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            }
            disabled:cursor-not-allowed
            disabled:bg-slate-100
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="mt-1 text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;