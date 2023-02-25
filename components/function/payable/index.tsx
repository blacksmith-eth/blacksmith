import { Button } from "components/button";
import { Field } from "components/field";
import { Inputs } from "components/inputs";
import { Listbox } from "components/listbox";
import {
  Abi,
  AbiDefinedPayableFunction,
  AbiParameterWithComponents,
  Address,
} from "core/types";
import { useArgs, useEther, useToggle } from "hooks";
import { useContractWrite } from "wagmi";
import { Container } from "../container";
import { Output } from "../output";
import { Signature } from "../signature";

type PayableProps = {
  address: Address;
  func: AbiDefinedPayableFunction;
  initialCollapsed: boolean;
};

export const Payable = ({ address, func, initialCollapsed }: PayableProps) => {
  const { args, formattedArgs, updateValue, isTouched } = useArgs(
    func.inputs as AbiParameterWithComponents[]
  );
  const { value, formattedValue, handleValueChange, unit, units, setUnit } =
    useEther();
  const { data, write, isLoading, isError, error } = useContractWrite<
    "recklesslyUnprepared",
    Abi,
    string
  >({
    abi: [func] as const,
    address,
    args: formattedArgs,
    functionName: func.name,
    mode: "recklesslyUnprepared",
    overrides: {
      value: formattedValue,
    },
  });
  const isDisabled = isLoading || !write;
  const handleClick = () => {
    write?.();
  };
  const { state: collapsed, toggle: toggleCollapsed } =
    useToggle(initialCollapsed);

  return (
    <li key={func.name} className="flex flex-col gap-2">
      <Signature
        func={func}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />

      {!collapsed && (
        <>
          <section className="flex flex-col">
            <div className="flex gap-1">
              <Field
                id={`${func.name}-value`}
                inputName="value"
                value={value}
                type="uint256"
                handleChange={handleValueChange}
              />
              <Listbox
                label="unit"
                options={units}
                selected={unit}
                setSelected={setUnit}
              />
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
        </>
      )}
    </li>
  );
};
