import { ReactElement, memo } from "react";

interface IfProps {
  condition: boolean;
  children: React.ReactNode | (() => any);
}

// read: render this content if the condition is true
const If: React.FC<IfProps> = ({ condition, children }: IfProps) => {
  // eslint-disable-next-line eqeqeq
  if (condition === true) {
    return (
      typeof children === "function" ? children() : children
    ) as ReactElement<any | null>;
  }
  return null;
};

export default memo(If);
