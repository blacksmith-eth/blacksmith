import { ethers } from "ethers";
import { ChangeEvent, useCallback, useState } from "react";

export const useEther = () => {
  const [value, setValue] = useState("");
  const formattedValue = ethers.utils.parseUnits(value || "0", "wei");
  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const updatedValue = event.target.value.replace(/\D/g, "");
      setValue(updatedValue);
    },
    []
  );

  return { value, formattedValue, handleValueChange };
};
