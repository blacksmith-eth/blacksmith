import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<Record<string, any>> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    className="self-start border border-black dark:border-white px-2 py-0.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none"
    {...props}
  >
    {children}
  </button>
);
