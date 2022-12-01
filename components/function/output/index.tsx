type OutputProps = {
  data: any | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any | null;
};

const formatData = (data: any | undefined): string => {
  if (data === undefined || data === null) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return `(${data.map(formatData).join(", ")})`;
  return data.toString();
};

const Output = ({ data, isLoading, isError, error }: OutputProps) => {
  if (isLoading) return <span>loading...</span>;
  if (isError)
    return (
      <span>{error && error.reason ? `Error: ${error.reason}` : "Error"}</span>
    );
  return <span>{formatData(data)}</span>;
};

export default Output;
