import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{}> &
  ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="border px-2 py-0.5 text-sm disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
