import React from "react";
import { Form } from "./components/form";

interface IProps {
  refetch: () => void;
}

export const Manage = (props: IProps) => {
  const { refetch } = props;
  return <Form refetch={refetch} />;
};
