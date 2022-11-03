import { Arg } from "core/types";

type InputsProps = {
  args: readonly Arg[];
  updateValue: (keys: number[], value: string) => void;
  name: string;
  keys?: number[];
};

const Inputs = ({ name, args, updateValue, keys = [] }: InputsProps) => {
  return (
    <ul>
      {args.map((arg, index) => {
        const inputName = arg.name || "keyOrIndex";
        const id = `${name}-${inputName}-${index}`;
        if (Array.isArray(arg.value)) {
          return (
            <fieldset key={id} className="border p-2">
              <legend>{arg.name}</legend>
              <Inputs
                name={arg.name}
                args={arg.value}
                updateValue={updateValue}
                keys={[...keys, index]}
              />
            </fieldset>
          );
        }

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          updateValue([...keys, index], event.target.value);
        };

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
              onChange={handleChange}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default Inputs;
