import { AnchorHTMLAttributes, DetailedHTMLProps } from "react";

type AnchorProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const Anchor = (props: AnchorProps) => (
  <a
    {...props}
    className="underline focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
  >
    {props.children}
  </a>
);
