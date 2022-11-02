import { Arg } from "core/types";

type InputsProps = {
  args: readonly Arg[];
  updateValue: (index: number, value: string) => void;
  name: string;
};

const Inputs = ({ name, args, updateValue }: InputsProps) => {
  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      updateValue(index, event.target.value);
    };
  return (
    <ul>
      {args.map((arg, index) => {
        const inputName = arg.name || "keyOrIndex";
        const id = `${name}-${inputName}-${index}`;
        return (
          <li key={`${inputName}-${index}`} className="flex flex-col">
            <label htmlFor={id}>
              {inputName} :: {arg.type}
            </label>
            <input
              id={id}
              type="text"
              className="border"
              value={arg.value}
              onChange={handleChange(index)}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default Inputs;
