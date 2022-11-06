import { Listbox } from "@headlessui/react";
import Button from "components/button";
import Field from "components/field";
import { useEther } from "hooks";
import { useState } from "react";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";

type WalletProps = {
  open: boolean;
};

const Wallet = ({ open }: WalletProps) => {
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

  if (!open) return <></>;
  return (
    <aside className="z-30 bg-white border-l p-2 fixed right-0 h-full w-full lg:w-96 overflow-y-auto overscroll-none">
      <h2 className="font-bold">wallet</h2>
      <h3 className="font-bold">Transfer</h3>
      <section className="flex flex-col gap-2">
        <Field
          inputName="recipient"
          type="address"
          id="recipient"
          value={recipient}
          handleChange={handleRecipientChange}
        />
        <div className="flex gap-1">
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
              <Listbox.Button className="border h-full w-full px-2 text-sm">
                {unit}
              </Listbox.Button>
              <Listbox.Options className="bg-white border absolute mt-1 right-0 focus:outline-none">
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
    </aside>
  );
};

export default Wallet;
