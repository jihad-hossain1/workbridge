import { clsx } from "clsx";
import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, resize = 'vertical', className, ...props }, ref) => {
        const resizeClass = {
            none: 'resize-none',
            both: 'resize',
            horizontal: 'resize-x',
            vertical: 'resize-y'
        }[resize];

        return (
            <div className="w-full">
                {label && (
                    <label className="block mb-2 text-sm font-medium text-foreground dark:text-slate-350" htmlFor={props.id || label}>
                        {label}
                    </label>
                )}

                <textarea
                    className={clsx(
                        'block w-full rounded-lg border border-input dark:border-slate-800 bg-background dark:bg-slate-950 p-2.5 text-sm text-foreground dark:text-slate-200 placeholder:text-muted-foreground dark:placeholder:text-slate-500 focus:border-primary focus:ring-primary focus:outline-none transition-colors',
                        resizeClass,
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    ref={ref}
                    rows={props.rows || 3}
                    {...props}
                />
                
                {error && (
                    <p className="mt-1 text-sm text-red-650 dark:text-red-400">{error}</p>
                )}
                
                {helperText && !error && (
                    <p className="mt-1 text-sm text-muted-foreground dark:text-slate-450">{helperText}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = "Textarea";