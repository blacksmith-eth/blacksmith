import { utils } from "ethers";
import { ChangeEvent, useCallback, useState } from "react";

export enum Units {
  wei = "wei",
  gwei = "gwei",
  finney = "finney",
  ether = "ether",
}

export const useEther = () => {
  const [unit, setUnit] = useState(Units.wei);
  const [value, setValue] = useState("");
  const formattedValue = utils.parseUnits(value || "0", unit);
  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const updatedValue = event.target.value.replace(/\D/g, "");
      setValue(updatedValue);
    },
    []
  );
  const units = Object.values(Units);

  return {
    formattedValue,
    handleValueChange,
    setUnit,
    unit,
    units,
    value,
  };
};
