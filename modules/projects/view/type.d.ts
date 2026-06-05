export type IProps = {
  id: string;
};

export type TProjectDetail = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  completedTasksCount: number;
  totalTasksCount: number;
  members: {
    id: string;
    role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  }[];
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
    assignee?: {
      firstName: string;
      lastName: string;
    };
  }[];
};

export type TAddMemberForm = {
  email: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
};
