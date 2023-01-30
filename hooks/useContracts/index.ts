import { ContractDetails } from "core/types";
import useSWR from "swr";

const fetchContracts = async (): Promise<ContractDetails[]> => {
  const response = await fetch("/api/contracts");
  const data = await response.json();
  return data;
};

export const useContracts = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "/api/contracts",
    fetchContracts
  );

  return {
    isLoading,
    mutate,
    contracts: data || [],
    isError: !!error,
  };
};
