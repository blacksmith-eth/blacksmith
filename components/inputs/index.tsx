import { AbiParameter } from "core/types";

type InputsProps = {
  values: string[];
  updateValue: (index: number, value: string) => void;
  name: string;
  inputs: readonly AbiParameter[];
};

const Inputs = ({ name, inputs, values, updateValue }: InputsProps) => {
  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      updateValue(index, event.target.value);
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
            value={values[index]}
            onChange={handleChange(index)}
          />
        </li>
      ))}
    </ul>
  );
};

export default Inputs;
