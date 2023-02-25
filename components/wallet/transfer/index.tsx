import { Button } from "components/button";
import { Field } from "components/field";
import { Listbox } from "components/listbox";
import { useEther } from "hooks";
import { ChangeEvent, useState } from "react";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";

export const Transfer = () => {
  const [recipient, setRecipient] = useState("");
  const { value, formattedValue, handleValueChange, unit, units, setUnit } =
    useEther();

  const { config } = usePrepareSendTransaction({
    request: { gasLimit: 10000000, to: recipient, value: formattedValue },
  });
  const { sendTransaction } = useSendTransaction(config);

  const handleRecipientChange = (event: ChangeEvent<HTMLInputElement>) => {
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
          <Listbox
            label="unit"
            options={units}
            selected={unit}
            setSelected={setUnit}
          />
        </div>
        <Button disabled={!sendTransaction} onClick={handleSendClick}>
          send
        </Button>
      </section>
    </div>
  );
};
