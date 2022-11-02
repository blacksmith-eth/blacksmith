import { Listbox } from "@headlessui/react";
import Button from "components/button";
import Inputs from "components/inputs";
import { AbiDefinedFunction, Address } from "core/types";
import { useArgs, useEther } from "hooks";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import Container from "../container";
import Signature from "../signature";

type PayableProps = {
  address: Address;
  func: AbiDefinedFunction;
};

const Payable = ({ address, func }: PayableProps) => {
  const { args, values, updateValue } = useArgs(func);
  const { value, formattedValue, handleValueChange, unit, units, setUnit } =
    useEther();
  const { config } = usePrepareContractWrite({
    address,
    abi: [func],
    functionName: func.name,
    args,
    overrides: {
      value: formattedValue,
    },
  });
  const { write, isLoading } = useContractWrite(config);
  const isDisabled = isLoading || !write;
  const handleClick = () => {
    write?.();
  };

  return (
    <li key={func.name}>
      <Signature func={func} />
      <section className="flex flex-col">
        <label htmlFor={`${func.name}-value`}>value :: uint256</label>
        <div className="flex gap-1">
          <input
            id={`${func.name}-value`}
            value={value}
            onChange={handleValueChange}
            type="text"
            className="border flex-1"
          />
          <Listbox value={unit} onChange={setUnit}>
            <Listbox.Label className="sr-only">unit</Listbox.Label>
            <div className="relative text-right">
              <Listbox.Button className="border w-full px-2">
                {unit}
              </Listbox.Button>
              <Listbox.Options className="border absolute mt-1 right-0 focus:outline-none">
                {units.map((unit) => (
                  <Listbox.Option
                    key={unit}
                    value={unit}
                    className={({ active }) =>
                      `${active ? "bg-black text-white" : ""} px-2`
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
      <Inputs
        name={func.name}
        inputs={func.inputs}
        values={values}
        updateValue={updateValue}
      />
      <Container>
        <Button type="button" disabled={isDisabled} onClick={handleClick}>
          send
        </Button>
      </Container>
    </li>
  );
};

export default Payable;
