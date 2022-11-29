import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{}> &
  ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="self-start border border-black dark:border-white px-2 py-0.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-black"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
