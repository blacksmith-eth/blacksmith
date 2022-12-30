import { Result } from "core/types";

type OutputProps = {
  data: Result;
  isTouched: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any | null;
};

const formatData = (data: Result): string => {
  if (data === undefined || data === null) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return `(${data.map(formatData).join(", ")})`;
  return data.toString();
};

export const Output = ({
  data,
  isTouched,
  isLoading,
  isError,
  error,
}: OutputProps) => {
  if (isLoading) return <span>loading...</span>;
  if (isError && isTouched)
    return (
      <span>{error && error.reason ? `Error: ${error.reason}` : "Error"}</span>
    );
  return <span>{formatData(data)}</span>;
};
