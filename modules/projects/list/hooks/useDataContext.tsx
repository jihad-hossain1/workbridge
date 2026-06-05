// useAffiliateReportContext
import React, { useContext } from "react";
import { DataContext } from "../DataProvider";
import { State } from "../type";

export const useDataContext = () => {
  const { state, dispatch } = useContext(DataContext);

  const dataList = React.useMemo(() => state.dataList, [state.dataList]);

  const pagination = React.useMemo(() => {
    return {
      page: state.page,
      pageSize: state.pageSize,
      totalPage: state.totalPages,
    };
  }, [state.page, state.pageSize, state.totalPages]);

  const filter = React.useMemo(() => state.filter, [state.filter]);

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

  const updatePage = React.useCallback(
    (page: number) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          page,
        },
      });
    },
    [dispatch],
  );

  const updatePageSize = React.useCallback(
    (pageSize: number) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          pageSize,
        },
      });
    },
    [dispatch],
  );

  const updateSearch = React.useCallback(
    (query: string) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          filter: {
            ...state.filter,
            query,
          },
        },
      });
    },
    [dispatch, state.filter, state.filter.query],
  );

  const resetFilter = React.useCallback(() => {
    dispatch({
      type: "RESET",
    });
  }, [dispatch]);

  const setStatusFilter = React.useCallback(
    (status: string) => {
      dispatch({
        type: "UPDATE_STATE",
        payload: {
          filter: {
            ...state.filter,
            status,
          },
        },
      });
    },
    [dispatch, state.filter],
  );

  return {
    ...state,
    dataList,
    pagination,
    filter,
    updateFilter,
    updatePage,
    updatePageSize,
    updateSearch,
    resetFilter,
    setStatusFilter,
  };
};
