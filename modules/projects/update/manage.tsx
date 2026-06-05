import React from "react";
import { Form } from "./components/form";
import { TDataList } from "../list/type";

interface IProps {
  refetch: () => void;
  selectedProject: TDataList;
  setIsEditOpen: (value: boolean) => void;
}

export const Manage = (props: IProps) => {
  const { refetch, selectedProject, setIsEditOpen } = props;
  return (
    <Form
      selectedProject={selectedProject}
      setIsEditOpen={setIsEditOpen}
      refetch={refetch}
    />
  );
};
