import { cn } from "@/utils/cn";
import {
  Loader,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  ListTree,
  ScrollText,
  Trash,
  FileSliders,
  FileSymlink,
  NotepadTextDashed,
  Pencil,
  Plus,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  File,
  Archive,
  ArchiveRestore,
  Activity,
  BaggageClaim,
  Cable,
  UsersRound,
  UserPlus,
  School,
  Magnet,
  FileText,
  SquarePen,
} from "lucide-react";

export const icons = {
  loader: Loader,
  mail: Mail,
  lock: Lock,
  eye: Eye,
  eyeOff: EyeOff,
  layout: LayoutDashboard,
  logout: LogOut,
  user: User,
  close: X,
  menu: Menu,
  bell: Bell,
  search: Search,
  settings: Settings,
  invoice: ScrollText,
  list: ListTree,
  trash: Trash,
  purchase: FileSliders,
  newPurchase: FileSymlink,
  supplier: NotepadTextDashed,
  edit: Pencil,
  add: Plus,
  phone: Phone,
  calendar: Calendar,
  arrowDown: ChevronDown,
  arrowUp: ChevronUp,
  file: File,
  archive: Archive,
  archiveRestore: ArchiveRestore,
  activity: Activity,
  item: BaggageClaim,
  category: Cable,
  users: UsersRound,
  userPlus: UserPlus,
  department: School,
  collections: Magnet,
  pdf: FileText,
  edit2: SquarePen,
};

export interface IconProps {
  name: keyof typeof icons;
  className?: string;
}

export const Icons = (props: IconProps) => {
  const { name, className } = props;

  // create icon component with name
  const IconComponent = icons[name];

  // render icon with name
  return <IconComponent className={cn("w-4 h-4 2xl:w-5 2xl:h-5", className)} />;
};
