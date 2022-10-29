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
      {inputs.map((input, index) => {
        const inputName = input.name || "keyOrIndex";
        return (
          <li key={`${inputName}-${index}`} className="flex flex-col">
            <label htmlFor={`${name}-${inputName}`}>
              {inputName} :: {input.type}
            </label>
            <input
              id={`${name}-${inputName}`}
              type="text"
              className="border"
              value={values[index]}
              onChange={handleChange(index)}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default Inputs;
