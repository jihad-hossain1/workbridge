import { LayoutDashboard, Package, Users, Bell, BookText } from "lucide-react";

export const sideMenus = [
  // Slice 0 to 1 (Workspace)
  {
    name: "Dashboard",
    href: "/main",
    icon: LayoutDashboard,
    color: "#0ea5e9", // Sky 500
    isSubMenu: false,
    subMenu: [],
  },

  // Slice 1 to 6 (Operations)
  {
    name: "Projects",
    href: "/main/projects",
    icon: Package,
    color: "#f97316", // Orange 500
    isSubMenu: false,
    subMenu: [],
  },
  {
    name: "Tasks Board",
    href: "/main/tasks",
    icon: BookText,
    color: "#6366f1", // Indigo 500
    isSubMenu: false,
    subMenu: [],
  },
  {
    name: "Team Directory",
    href: "/main/teams",
    icon: Users,
    color: "#8b5cf6", // Purple 500
    isSubMenu: false,
    subMenu: [],
  },
  {
    name: "Notifications",
    href: "/main/notify",
    icon: Bell,
    color: "#ec4899", // Pink 500
    isSubMenu: false,
    subMenu: [],
  },
];
