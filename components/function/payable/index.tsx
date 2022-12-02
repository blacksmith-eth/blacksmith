import { Listbox } from "@headlessui/react";
import Button from "components/button";
import Field from "components/field";
import Inputs from "components/inputs";
import {
  AbiDefinedFunction,
  AbiParameterWithComponents,
  Address,
} from "core/types";
import { useArgs, useEther } from "hooks";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Container from "../container";
import Output from "../output";
import Signature from "../signature";

type PayableProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const Payable = ({ address, func }: PayableProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );
  const { value, formattedValue, handleValueChange, unit, units, setUnit } =
    useEther();
  const { config } = usePrepareContractWrite({
    address,
    abi: [func],
    functionName: func.name,
    args: formattedArgs,
    overrides: {
      value: formattedValue,
    },
  });
  const { data, write, isLoading, isError, error } = useContractWrite(config);
  const isDisabled = isLoading || !write;
  const handleClick = () => {
    write?.();
  };

  return (
    <li key={func.name} className="flex flex-col gap-2">
      <Signature func={func} />
      <section className="flex flex-col">
        <div className="flex gap-1">
          <Field
            id={`${func.name}-value`}
            inputName="value"
            value={value}
            type="uint256"
            handleChange={handleValueChange}
          />
          <Listbox value={unit} onChange={setUnit}>
            <Listbox.Label className="sr-only">unit</Listbox.Label>
            <div className="relative text-right select-none">
              <Listbox.Button className="border border-black dark:border-white h-full w-full px-2 text-sm hover:bg-black hover:text-white focus:bg-black focus:text-white dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none">
                {unit}
              </Listbox.Button>
              <Listbox.Options className="bg-white dark:bg-black border border-black dark:border-white absolute mt-1 right-0 focus:outline-none">
                {units.map((unit) => (
                  <Listbox.Option
                    key={unit}
                    value={unit}
                    className={({ active }) =>
                      `${
                        active
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : ""
                      } px-2`
                    }
                  >
                    {unit}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </section>
      <Inputs name={func.name} args={args} updateValue={updateValue} />
      <Container>
        <Button type="button" disabled={isDisabled} onClick={handleClick}>
          send
        </Button>
        <Output
          data={data ? data.hash : undefined}
          isTouched={isTouched}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </Container>
    </li>
  );
};

export default Payable;
