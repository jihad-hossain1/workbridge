import { TAuthUser } from "@/lib/auth/ServerAuth";
import { LucideIcon } from "lucide-react";

export type HProps = {
  menuItems: { title: string; href: string }[];
  handleLogout: () => void;
  session: TAuthUser | null;
};

export type TSideProps = {
  title: string;
  handleLogout: () => void;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

export interface NavLinkProps {
  href?: string;
  icon: LucideIcon;
  name: string;
  isActive: boolean;
  onClick?: () => void;
  isSubMenu?: boolean;
  subMenu?: { name: string; href: string; icon: LucideIcon }[];
  color?: string;
  isCollapsed?: boolean;
}
