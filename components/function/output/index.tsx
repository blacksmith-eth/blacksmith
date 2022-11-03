import { Result } from "ethers/lib/utils";

type OutputProps = {
  data: Result | undefined;
  isLoading: boolean;
  isError: boolean;
};

const formatData = (data: Result | undefined): string => {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return `(${data.map(formatData).join(", ")})`;
  return data.toString();
};

const Output = ({ data, isLoading, isError }: OutputProps) => {
  if (isLoading) return <span>loading...</span>;
  if (isError) return <span>error</span>;
  return <span>{formatData(data)}</span>;
};

export default Output;
