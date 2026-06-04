"use client";

import React, { useState } from 'react';

interface AnimatedMenuIconProps {
  className?: string;
  onToggle?: (isOpen: boolean) => void;
  size?: number;
  color?: string;
  strokeWidth?: number;
  initialState?: boolean;
  duration?: number;
}

export const OpenMenu: React.FC<AnimatedMenuIconProps> = ({
  className = "",
  onToggle,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  initialState = false,
  duration = 0.4
}) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const handleClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div 
      className={`inline-block cursor-pointer ${className}`}
      onClick={handleClick}
      role="button"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      tabIndex={0}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            line {
              stroke: ${color};
              stroke-width: ${strokeWidth};
              transition: transform ${duration}s ease-in-out, opacity ${duration * 0.75}s ease-in-out;
              transform-origin: center;
            }
            
            .line1 {
              transform: ${isOpen ? 'translateY(6px) rotate(45deg)' : 'none'};
            }
            
            .line2 {
              opacity: ${isOpen ? 0 : 1};
            }
            
            .line3 {
              transform: ${isOpen ? 'translateY(-6px) rotate(-45deg)' : 'none'};
            }
          `}
        </style>
        <line className="line1" x1="4" y1="6" x2="20" y2="6" />
        <line className="line2" x1="4" y1="12" x2="20" y2="12" />
        <line className="line3" x1="4" y1="18" x2="20" y2="18" />
      </svg>
    </div>
  );
};
