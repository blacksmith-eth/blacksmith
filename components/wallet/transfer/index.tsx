import { Listbox } from "@headlessui/react";
import Button from "components/button";
import Field from "components/field";
import { useEther } from "hooks";
import { useState } from "react";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";

const Transfer = () => {
  const [recipient, setRecipient] = useState("");
  const { value, formattedValue, handleValueChange, unit, units, setUnit } =
    useEther();

  const { config } = usePrepareSendTransaction({
    request: { to: recipient, value: formattedValue, gasLimit: 10000000 },
  });
  const { sendTransaction } = useSendTransaction(config);

  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipient(event.target.value);
  };

  const handleSendClick = () => {
    sendTransaction?.();
  };

  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-bold">Transfer</h2>
      <section className="flex flex-col gap-2">
        <Field
          inputName="recipient"
          type="address"
          id="recipient"
          value={recipient}
          handleChange={handleRecipientChange}
        />
        <div className="flex gap-1 z-10">
          <Field
            id="value"
            inputName="value"
            value={value}
            type="uint256"
            handleChange={handleValueChange}
          />
          <Listbox value={unit} onChange={setUnit}>
            <Listbox.Label className="sr-only">unit</Listbox.Label>
            <div className="relative text-right select-none">
              <Listbox.Button className="border border-black h-full w-full px-2 text-sm">
                {unit}
              </Listbox.Button>
              <Listbox.Options className="bg-white border border-black absolute mt-1 right-0 focus:outline-none">
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
        <Button disabled={!sendTransaction} onClick={handleSendClick}>
          send
        </Button>
      </section>
    </div>
  );
};

export default Transfer;
