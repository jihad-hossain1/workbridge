export type TTask = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status:
    | "BACKLOG"
    | "TODO"
    | "IN_PROGRESS"
    | "IN_REVIEW"
    | "BLOCKED"
    | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
  assigneeId: string | null;
  project: {
    id: string;
    name: string;
  };
  assignee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export type TComment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export type TAttachment = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
  uploadedBy?: {
    firstName: string;
    lastName: string;
  };
};

export type TTaskForm = {
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assigneeId: string;
};

export type TProject = {
  id: string;
  name: string;
  status: string;
};

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type State = {
  dataList: TTask[];
  projects: TProject[];
  projectMembers: TUser[];
  filter: {
    projectId?: string;
    assigneeId?: string;
    priority?: string;
    query?: string;
  };
  page: number;
  pageSize: number;
  totalPages: number;
  isCreateOpen: boolean;
  isDetailsOpen: boolean;
  activeTask: TTask | null;
  comments: TComment[];
  attachments: TAttachment[];
};

export type SetStateAction = {
  type: "SET_STATE";
  payload: State;
};

export type UpdateState = {
  type: "UPDATE_STATE";
  payload: Partial<State>;
};

export type ResetAction = {
  type: "RESET";
};

export type Action = SetStateAction | UpdateState | ResetAction;
