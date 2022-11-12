import Field from "components/field";
import { Arg } from "core/types";

type InputsProps = {
  args: readonly Arg[];
  updateValue: (keys: number[], value: string) => void;
  name: string;
  keys?: number[];
};

const Inputs = ({ name, args, updateValue, keys = [] }: InputsProps) => {
  if (args.length === 0) return <></>;
  return (
    <ul className="flex flex-col gap-2">
      {args.map((arg, index) => {
        const id = `${name}-${arg.name}-${index}`;
        if (Array.isArray(arg.value)) {
          return (
            <fieldset key={id} className="border border-black p-2">
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
          <Field
            key={id}
            inputName={arg.name}
            value={arg.value}
            type={arg.type}
            id={id}
            handleChange={handleChange}
          />
        );
      })}
    </ul>
  );
};

export default Inputs;
