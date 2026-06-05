// affiliate type
export type TDataList = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";
};

export type State = {
  dataList: TDataList[];
  filter: {
    query?: string;
    status?: string;
  };
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SEtStateAction = {
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

export type Action = SEtStateAction | UpdateState | ResetAction;

export type TableProps = {
  dataList: TDataList[];
  isLoading?: boolean;
  error?: string | null;
  refetch?: () => void | undefined;
};
