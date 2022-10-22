import { AbiParameter } from "core/types";

type InputsProps = {
  args: string[];
  updateArg: (index: number, value: string) => void;
  name: string;
  inputs: readonly AbiParameter[];
};

const Inputs = ({ args, name, inputs, updateArg }: InputsProps) => {
  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      updateArg(index, event.target.value);
    };
  return (
    <ul>
      {inputs.map((input, index) => (
        <li key={input.name} className="flex flex-col">
          <label htmlFor={`${name}-${input.name}`}>
            {input.name} :: {input.type}
          </label>
          <input
            id={`${name}-${input.name}`}
            type="text"
            className="border"
            value={args[index]}
            onChange={handleChange(index)}
          />
        </li>
      ))}
    </ul>
  );
};

export default Inputs;
