import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";

type FieldProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  inputName: string;
  type: string;
  value: string;
};

export const Field = ({
  inputName,
  disabled,
  value,
  type,
  id,
  handleChange,
  ...rest
}: FieldProps) => (
  <li className={`flex flex-grow items-center ${disabled ? "opacity-50" : ""}`}>
    <span className="min-w-fit bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white border-r-0 px-1 py-1.5 text-sm">
      {type}
    </span>
    <div className="relative w-full">
      <input
        id={id}
        type="text"
        className="bg-white dark:bg-black border border-black dark:border-white px-1 py-1 w-full peer focus:outline-none"
        placeholder=" "
        disabled={disabled}
        value={value}
        onChange={handleChange}
        {...rest}
      />
      <label
        htmlFor={id}
        className="bg-white dark:bg-black absolute duration-300 text-sm transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {inputName}
      </label>
    </div>
  </li>
);
