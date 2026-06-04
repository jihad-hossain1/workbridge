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
                    <label className="block mb-2 text-sm font-medium text-foreground" htmlFor={props.id || label}>
                        {label}
                    </label>
                )}

                <textarea
                    className={clsx(
                        'block w-full rounded-lg border border-input bg-background p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary focus:outline-none transition-colors',
                        resizeClass,
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    ref={ref}
                    rows={props.rows || 3}
                    {...props}
                />
                
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
                
                {helperText && !error && (
                    <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = "Textarea";