import { clsx } from "clsx";
import React, { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className,
      type,
      leftIcon,
      rightIcon,
      iconClassName = "w-4 h-4",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block mb-2 text-xs 2xl:text-sm text-foreground"
            htmlFor={label}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className={clsx(
                "absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-500",
                iconClassName
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={clsx(
              "block w-full rounded-sm border border-input bg-background text-xs 2xl:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-200 focus:ring-blue-200",
              leftIcon ? "pl-10" : "px-3",
              rightIcon ? "pr-10" : "px-3",
              "py-1",
              className
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div
              className={clsx(
                "absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-gray-500",
                iconClassName
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs 2xl:text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
