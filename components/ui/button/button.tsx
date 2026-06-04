import { clsx } from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "success"
    | "danger"
    | "warning"
    | "info";
  size?: "sm" | "md" | "lg" | "xs";

  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  iconClassName?: string;
  button_color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "ocean"
    | "sunset"
    | "forest"
    | "royal"
    | "rose"
    | "mint"
    | "amber"
    | "violet"
    | "coral"
    | "teal"
    | "crimson"
    | "emerald"
    | "sapphire"
    | "bronze"
    | "lavender"
    | "cherry"
    | "slate"
    | "gold"
    | "indigo"
    | "copper"
    | "outline";
}

export const Button = ({
  children,
  variant = "default",
  size = "sm",
  className,
  button_color = "primary",
  disabled = false,
  icon,
  iconPosition = "left",
  iconClassName = "h-4 w-4",
  ...props
}: ButtonProps) => {
  const sizes = {
    xs: "h-6 px-2 text-[10px]",
    sm: "h-6 px-2 text-[10px] 2xl:h-8 2xl:px-3 2xl:text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  const color = {
    primary: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90",
    secondary: "bg-zinc-200 text-zinc-500 cursor-not-allowed",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    info: "bg-blue-500 text-white hover:bg-blue-600",
    outline:
      "border border-input bg-background hover:bg-muted/50 hover:text-primary",
    ghost: "hover:bg-muted/50 hover:text-primary",
    disabled: "bg-zinc-200 text-zinc-500 cursor-not-allowed",
    // Professional gradient color presets
    ocean:
      "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg",
    sunset:
      "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg",
    forest:
      "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600 shadow-lg",
    royal:
      "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg",
    rose: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 shadow-lg",
    mint: "bg-gradient-to-r from-teal-400 to-green-400 text-white hover:from-teal-500 hover:to-green-500 shadow-lg",
    amber:
      "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg",
    violet:
      "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg",
    coral:
      "bg-gradient-to-r from-red-400 to-pink-400 text-white hover:from-red-500 hover:to-pink-500 shadow-lg",
    teal: "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg",
    crimson:
      "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg",
    emerald:
      "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-lg",
    sapphire:
      "bg-gradient-to-r from-blue-700 to-indigo-600 text-white hover:from-blue-800 hover:to-indigo-700 shadow-lg",
    bronze:
      "bg-gradient-to-r from-yellow-700 to-orange-700 text-white hover:from-yellow-800 hover:to-orange-800 shadow-lg",
    lavender:
      "bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg",
    cherry:
      "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg",
    slate:
      "bg-gradient-to-r from-slate-600 to-gray-600 text-white hover:from-slate-700 hover:to-gray-700 shadow-lg",
    gold: "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-700 hover:to-yellow-600 shadow-lg",
    indigo:
      "bg-gradient-to-r from-indigo-600 to-purple-500 text-white hover:from-indigo-700 hover:to-purple-600 shadow-lg",
    copper:
      "bg-gradient-to-r from-orange-700 to-red-600 text-white hover:from-orange-800 hover:to-red-700 shadow-lg",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:cursor-not-allowed text-nowrap",
        color[button_color],
        sizes[size],
        { "opacity-50 cursor-not-allowed": disabled },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className={clsx("mr-2", iconClassName)}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={clsx("ml-2", iconClassName)}>{icon}</span>
      )}
    </button>
  );
};

Button.displayName = "Button";
