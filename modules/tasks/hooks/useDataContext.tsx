import React, { useContext } from "react";
import { DataContext } from "../DataProvider";
import { State } from "../type";

export const useDataContext = () => {
  const { state, dispatch } = useContext(DataContext);

  const updateState = React.useCallback(
    (payload: Partial<State>) => {
      dispatch({
        type: "UPDATE_STATE",
        payload,
      });
    },
    [dispatch],
  );

  const updateFilter = React.useCallback(
    (filter: State["filter"]) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          filter: { ...state.filter, ...filter },
        },
      });
    },
    [dispatch, state.filter],
  );

  const updateSearch = React.useCallback(
    (query: string) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          filter: { ...state.filter, query },
        },
      });
    },
    [dispatch, state.filter],
  );

  const resetFilter = React.useCallback(() => {
    dispatch({
      type: "UPDATE_STATE",
      payload: {
        filter: {
          projectId: "",
          assigneeId: "",
          priority: "",
          query: "",
        },
      },
    });
  }, [dispatch]);

  const setIsCreateOpen = React.useCallback(
    (isOpen: boolean) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { isCreateOpen: isOpen },
      });
    },
    [dispatch],
  );

  const setActiveTask = React.useCallback(
    (task: State["activeTask"]) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { activeTask: task },
      });
    },
    [dispatch],
  );

  const setIsDetailsOpen = React.useCallback(
    (isOpen: boolean) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: { isDetailsOpen: isOpen },
      });
    },
    [dispatch],
  );

  return {
    ...state,
    updateState,
    updateFilter,
    updateSearch,
    resetFilter,
    setIsCreateOpen,
    setActiveTask,
    setIsDetailsOpen,
  };
};
