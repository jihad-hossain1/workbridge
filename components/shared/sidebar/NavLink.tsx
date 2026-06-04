import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import styles from "./sidebar.module.css";
import { NavLinkProps } from "./types";

export const NavLink = (props: NavLinkProps) => {
  const {
    href,
    icon: Icon,
    name,
    isActive,
    onClick,
    isSubMenu,
    subMenu,
    color,
    isCollapsed,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  const isChildActive = Boolean(
    subMenu?.some(
      (item) => item.href === pathName || pathName.startsWith(`${item.href}/`)
    )
  );

  // Auto-close submenu when collapsing sidebar
  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (isChildActive && !isCollapsed) {
      setIsOpen(true);
    }
  }, [isChildActive, isCollapsed]);

  // Handle submenu toggle
  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  if (isSubMenu && subMenu) {
    return (
      <div className={cn("relative", isCollapsed && "group/collapsed")}>
        <button
          onClick={toggleSubMenu}
          className={cn(
            styles.navItem,
            (isActive || isChildActive) && styles.navItemActive,
            "w-full justify-between",
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Icon
              className={cn(
                styles.icon,
                (isActive || isChildActive) && "text-inherit",
              )}
              color={!(isActive || isChildActive) ? color : undefined}
            />
            <span className={styles.navText}>{name}</span>
          </div>
          <div
            className={cn(
              styles.chevron,
              "transition-transform duration-200 ease-out",
              isOpen && "rotate-90",
            )}
          >
            <ChevronRight className="h-4 w-4 opacity-50" />
          </div>
        </button>
        {isOpen && (
          <div
            className={cn(
              "overflow-hidden animate-accordion-down",
              styles.subMenu
            )}
          >
            <div className="mt-1 space-y-1">
              {subMenu.map((item, index) => {
                const SubIcon = item.icon;
                const isItemActive = item.href === pathName;
                return (
                  <Link
                    key={index}
                    onClick={onClick}
                    href={item.href}
                    className={cn(
                      styles.navItem,
                      styles.subNavItem,
                      isItemActive && styles.navItemActive,
                    )}
                  >
                    <SubIcon
                      className={cn(
                        styles.icon,
                        isItemActive && "text-inherit",
                      )}
                      color={!isItemActive ? color : undefined}
                      size={18}
                    />
                    <span className={styles.navText}>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href || "#"}
      onClick={onClick}
      className={cn(
        styles.navItem,
        isActive && styles.navItemActive,
        "group"
      )}
    >
      <Icon
        className={cn(styles.icon, isActive && "text-inherit")}
        color={!isActive ? color : undefined}
      />
      <span className={styles.navText}>{name}</span>
    </Link>
  );
};

export const NavButton = (props: NavLinkProps) => {
  const { icon: Icon, name, isActive, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={cn(
        `
        group flex gap-x-3 rounded-md p-1 2xl:p-2 text-sm 2xl:font-semibold leading-6
        transition-all duration-200 ease-in-out
      `,
        isActive
          ? "bg-gray-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
      )}
    >
      <Icon
        className={cn(
          `h-3.5 w-3.5 2xl:h-4 2xl:w-4 shrink-0 transition-colors duration-200`,
          isActive
            ? "text-blue-600"
            : "text-gray-400 group-hover:text-blue-600",
        )}
      />
      {name}
    </button>
  );
};
