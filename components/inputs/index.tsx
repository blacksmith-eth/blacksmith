import Button from "components/button";
import Field from "components/field";
import { Arg } from "core/types";

type InputsProps = {
  args: readonly Arg[];
  updateValue: (keys: number[], value: string | Arg[]) => void;
  name: string;
  keys?: number[];
  preview?: boolean;
  child?: boolean;
};

const Inputs = ({
  name,
  args,
  updateValue,
  keys = [],
  preview = false,
  child = false,
}: InputsProps) => {
  if (args.length === 0) return <></>;
  return (
    <ul className="flex flex-1 flex-col gap-2">
      {args.map((arg, index) => {
        const id = `${name}-${arg.name}-${index}`;
        if (arg.type.slice(-2) === "[]") {
          return (
            <fieldset key={id} className="border border-black p-2 -mt-2">
              <legend className="text-sm">{arg.name}</legend>
              <div className="flex flex-col gap-2">
                <Inputs
                  name={id}
                  args={arg.value as Arg[]}
                  updateValue={updateValue}
                  keys={[...keys, index]}
                  child={true}
                />
                <div className="flex gap-1">
                  <Button
                    disabled={preview}
                    onClick={() => {
                      updateValue([...keys, index], [
                        ...arg.value,
                        arg.childArg,
                      ] as Arg[]);
                    }}
                  >
                    +
                  </Button>
                  <Inputs
                    name={arg.name}
                    args={arg.childArg ? [arg.childArg] : []}
                    updateValue={updateValue}
                    keys={[...keys, index]}
                    preview={true}
                  />
                </div>
              </div>
            </fieldset>
          );
        }
        if (Array.isArray(arg.value) && arg.type === "tuple") {
          return (
            <div key={id} className="flex gap-1">
              {!preview && child ? <Button>-</Button> : <></>}
              <fieldset className="flex-1 border border-black p-2 -mt-2">
                <legend className="text-sm">{arg.name}</legend>
                <Inputs
                  name={arg.name}
                  args={arg.value}
                  updateValue={updateValue}
                  keys={[...keys, index]}
                  preview={preview}
                />
              </fieldset>
            </div>
          );
        }

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          updateValue([...keys, index], event.target.value);
        };

        return (
          <div className="flex gap-1" key={id}>
            {!preview && child ? <Button>-</Button> : <></>}
            <Field
              disabled={preview}
              inputName={arg.name}
              value={arg.value as string}
              type={arg.type}
              id={id}
              handleChange={handleChange}
            />
          </div>
        );
      })}
    </ul>
  );
};

export default Inputs;
