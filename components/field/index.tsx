type FieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  inputName: string;
  type: string;
  value: string;
};

const Field = ({
  inputName,
  value,
  type,
  id,
  handleChange,
  ...rest
}: FieldProps) => {
  return (
    <li className="flex flex-grow items-center">
      <span className="bg-slate-100 border border-slate-300 border-r-0 px-1 py-1.5 text-sm">
        {type}
      </span>
      <div className="relative w-full">
        <input
          id={id}
          type="text"
          className="border border-slate-300 px-1 py-1 w-full peer focus:outline-none"
          placeholder=" "
          value={value}
          onChange={handleChange}
          {...rest}
        />
        <label
          htmlFor={id}
          className="bg-white absolute duration-300 text-sm transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {inputName}
        </label>
      </div>
    </li>
  );
};

export default Field;
