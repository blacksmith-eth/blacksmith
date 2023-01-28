import { ComponentProps, JSXElementConstructor } from "react";

export type PartialProps<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = Partial<ComponentProps<T>>;
