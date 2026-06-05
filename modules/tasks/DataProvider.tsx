import React from "react";
import { Action, State } from "./type";

const initialState: State = {
  dataList: [],
  projects: [],
  projectMembers: [],
  filter: {
    projectId: "",
    assigneeId: "",
    priority: "",
    query: "",
  },
  page: 1,
  pageSize: 100,
  totalPages: 1,
  isCreateOpen: false,
  isDetailsOpen: false,
  activeTask: null,
  comments: [],
  attachments: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;
    case "UPDATE_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "RESET":
      return initialState;
    default:
      throw new Error("Unknown action type");
  }
};

export const DataContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const DataProvider = ({
  children,
  initialProjectId = "",
}: {
  children: React.ReactNode;
  initialProjectId?: string;
}) => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    filter: {
      ...initialState.filter,
      projectId: initialProjectId,
    },
  });

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
