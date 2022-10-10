import { AbiParameter } from "core/types";

type InputsProps = {
  name: string;
  inputs: readonly AbiParameter[];
};

const Inputs = ({ name, inputs }: InputsProps) => {
  return (
    <ul>
      {inputs.map((input) => (
        <li key={input.name} className="flex flex-col">
          <label htmlFor={`${name}-${input.name}`}>
            {input.name} :: {input.type}
          </label>
          <input id={`${name}-${input.name}`} type="text" className="border" />
        </li>
      ))}
    </ul>
  );
};

export default Inputs;
