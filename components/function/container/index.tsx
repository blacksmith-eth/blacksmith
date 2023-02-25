import { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<Record<string, any>>;

export const Container = ({ children }: ContainerProps) => (
  <section className="flex items-center gap-1">{children}</section>
);
