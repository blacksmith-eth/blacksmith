import { ChangeEvent, useCallback, useState } from "react";
import { parseUnits } from "viem";

export enum Units {
  wei = "wei",
  gwei = "gwei",
  finney = "finney",
  ether = "ether",
}

type UnitNameToExponent = {
  [key in Units]: number;
};

const unitNameToExponent: UnitNameToExponent = {
  wei: 0,
  gwei: 9,
  finney: 15,
  ether: 18,
};

export const useEther = () => {
  const [unit, setUnit] = useState(Units.wei);
  const [value, setValue] = useState<`${number}` | "">("");
  const formattedValue = parseUnits(value || "0", unitNameToExponent[unit]);
  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const updatedValue = event.target.value.replace(/\D/g, "") as `${number}`;
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
