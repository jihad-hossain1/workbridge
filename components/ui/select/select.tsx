"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "filled";
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  onChange?: (value: string | string[]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const selectVariants = {
  variant: {
    default:
      "border border-gray-300 bg-white hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100",
    outline:
      "border-2 border-blue-200 bg-white hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100",
    filled:
      "border-0 bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border focus-within:border-blue-500",
  },
  size: {
    sm: "h-8 px-3 py-1 text-sm",
    md: "h-8 px-2 py-1 text-xs 2xl:h-10 2xl:px-4 2xl:py-2 2xl:text-sm",
    lg: "h-12 px-4 py-3 text-base",
  },
};

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      placeholder = "Select an option...",
      disabled = false,
      error = false,
      errorMessage,
      helperText,
      label,
      required = false,
      clearable = false,
      multiple = false,
      size = "md",
      variant = "default",
      className,
      dropdownClassName,
      optionClassName,
      onChange,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | string[]>(
      multiple
        ? (value as unknown as string[]) || []
        : value || defaultValue || ""
    );
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options;

    // Get display value
    const getDisplayValue = () => {
      if (multiple) {
        const selected = selectedValue as string[];
        if (selected.length === 0) return placeholder;
        if (selected.length === 1) {
          const option = options.find((opt) => opt.value === selected[0]);
          return option?.label || selected[0];
        }
        return `${selected.length} items selected`;
      } else {
        const option = options.find((opt) => opt.value === selectedValue);
        return option?.label || placeholder;
      }
    };

    // Handle option selection
    const handleOptionSelect = (optionValue: string) => {
      let newValue: string | string[];

      if (multiple) {
        const currentValues = selectedValue as string[];
        if (currentValues.includes(optionValue)) {
          newValue = currentValues.filter((v) => v !== optionValue);
        } else {
          newValue = [...currentValues, optionValue];
        }
      } else {
        newValue = optionValue;
        setIsOpen(false);
      }

      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newValue = multiple ? [] : "";
      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (
            focusedIndex >= 0 &&
            focusedIndex < filteredOptions.length
          ) {
            handleOptionSelect(filteredOptions[focusedIndex].value);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll focused option into view
    useEffect(() => {
      if (focusedIndex >= 0 && optionsRef.current) {
        const focusedElement = optionsRef.current.children[
          focusedIndex
        ] as HTMLElement;
        if (focusedElement) {
          focusedElement.scrollIntoView({ block: "nearest" });
        }
      }
    }, [focusedIndex]);

    const hasValue = multiple
      ? (selectedValue as string[]).length > 0
      : selectedValue !== "";

    return (
      <div className="w-full" ref={ref}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
            {label}
            {required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </label>
        )}

        <div className="relative" ref={selectRef}>
          <div
            className={cn(
              "relative w-full cursor-pointer rounded-lg transition-all duration-200 ease-in-out",
              "shadow-sm hover:shadow-md focus-within:shadow-lg",
              selectVariants.variant[variant],
              selectVariants.size[size],
              error &&
                "border-red-400 focus-within:border-red-500 focus-within:ring-red-100",
              disabled && "cursor-not-allowed opacity-60 bg-gray-100",
              isOpen && "ring-2 ring-blue-100 border-blue-500 shadow-lg",
              className
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={isOpen ? "select-listbox" : undefined}
            aria-label={label}
          >
            <div className="flex items-center justify-between w-full">
              <span
                className={cn(
                  "block truncate font-medium",
                  !hasValue && "text-gray-500 font-normal",
                  hasValue && "text-gray-900"
                )}
              >
                {getDisplayValue()}
              </span>

              <div className="flex items-center space-x-1">
                {clearable && hasValue && !disabled && (
                  <button
                    type="button"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-150 text-gray-400 hover:text-gray-600"
                    onClick={handleClear}
                    tabIndex={-1}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 text-gray-500",
                    isOpen && "transform rotate-180 text-blue-500"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div
              className={cn(
                "absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl",
                "max-h-64 overflow-auto animate-in fade-in-0 zoom-in-95 duration-200",
                "backdrop-blur-sm",
                dropdownClassName
              )}
            >
              <div ref={optionsRef} role="listbox" id="select-listbox">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <div className="text-gray-400 text-sm font-medium">
                      No options available
                    </div>
                    <div className="text-gray-300 text-xs mt-1">
                      Try adjusting your selection criteria
                    </div>
                  </div>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = multiple
                      ? (selectedValue as string[]).includes(option.value)
                      : selectedValue === option.value;
                    const isFocused = index === focusedIndex;

                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "relative cursor-pointer select-none 2xl:px-4 2xl:py-3 px-3 py-1 text-xs 2xl:text-sm transition-all duration-150",
                          "hover:bg-blue-50 hover:text-blue-700",
                          isFocused && "bg-blue-50 text-blue-700",
                          isSelected && "bg-blue-100 text-blue-800 font-medium",
                          option.disabled &&
                            "cursor-not-allowed opacity-50 bg-gray-50",
                          "border-b border-gray-50 last:border-b-0",
                          optionClassName
                        )}
                        onClick={() =>
                          !option.disabled && handleOptionSelect(option.value)
                        }
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div
                              className={cn(
                                "font-medium leading-tight",
                                isSelected && "text-blue-800"
                              )}
                            >
                              {option.label}
                            </div>
                            {option.description && (
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {option.description}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 ml-3 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <div className="mt-2">
            <p
              className={cn(
                "text-xs leading-relaxed",
                error ? "text-red-600 font-medium" : "text-gray-500"
              )}
            >
              {error ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errorMessage}
                </span>
              ) : (
                helperText
              )}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

// Additional components for shadcn/ui compatibility
const SelectTrigger = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => (
  <span ref={ref} className={cn("block truncate", className)} {...props}>
    {props.children || placeholder}
  </span>
));
SelectValue.displayName = "SelectValue";

const SelectContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectContent.displayName = "SelectContent";

const SelectItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
