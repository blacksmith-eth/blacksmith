import { ContractDetails } from "core/types";
import useSWR from "swr";

const fetchContracts = async (): Promise<ContractDetails[]> => {
  const response = await fetch("/api/contracts");
  const data = await response.json();
  return data;
};

export const useContracts = () => {
  const { data, error } = useSWR("/api/contracts", fetchContracts);

  return {
    contracts: data,
    isLoading: !error && !data,
    isError: !!error,
  };
};
