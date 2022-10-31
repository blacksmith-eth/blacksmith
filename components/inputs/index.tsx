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
        const id = `${name}-${inputName}-${index}`;
        return (
          <li key={`${inputName}-${index}`} className="flex flex-col">
            <label htmlFor={id}>
              {inputName} :: {input.type}
            </label>
            <input
              id={id}
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
