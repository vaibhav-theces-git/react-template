import React from "react";
import { TableBodyProps } from "react-table";

interface TbodyComponentProps extends TableBodyProps {
  children: React.ReactNode;
}

const TbodyComponent = ({ children, ...rest }: TbodyComponentProps) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <div {...rest}>{children}</div>;
};

export default TbodyComponent;
