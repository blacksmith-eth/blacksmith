import { Result } from "ethers/lib/utils";

type OutputProps = {
  data: Result | undefined;
  isLoading: boolean;
  isError: boolean;
};

const Output = ({ data, isLoading, isError }: OutputProps) => {
  if (isLoading) return <span>loading...</span>;
  if (isError) return <span>error</span>;
  return <span>{data?.toString()}</span>;
};

export default Output;
