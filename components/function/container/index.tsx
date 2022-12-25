import { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{}>;

export const Container = ({ children }: ContainerProps) => {
  return <section className="flex items-center gap-1">{children}</section>;
};
