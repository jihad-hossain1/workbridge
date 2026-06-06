export type TNotification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type State = {
  dataList: TNotification[];
  filter: {
    query?: string;
  };
  page: number;
  pageSize: number;
  totalPages: number;
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

export type TableProps = {
  dataList: TNotification[];
  isLoading?: boolean;
  error?: string | null;
  refetch?: () => void | undefined;
};
