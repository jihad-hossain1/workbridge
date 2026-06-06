import React from "react";
import { Action, State } from "./type";

const initialState: State = {
  dataList: [],
  filter: {
    query: "",
  },
  page: 1,
  pageSize: 10,
  totalPages: 1,
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

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
