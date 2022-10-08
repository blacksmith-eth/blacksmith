import useSWR from "swr";

const fetchContracts = async () => {
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
