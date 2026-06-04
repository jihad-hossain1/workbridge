import React from "react";

// Custom Slot Component
interface SlotProps {
    children?: React.ReactNode;
    [key: string]: any;
}

export const Slot = React.forwardRef<any, SlotProps>(
    ({ children, ...props }, ref) => {
        const child = React.Children.only(children) as React.ReactElement
        const childProps = { ...props }
        if (ref) {
            (childProps as any).ref = ref
        }
        return React.cloneElement(child, childProps)
    }
)
Slot.displayName = "Slot"