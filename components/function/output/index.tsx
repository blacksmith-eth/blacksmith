type OutputProps = {
  data: any | undefined;
  isTouched: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any | null;
  isPrepareError: boolean;
  prepareError: any | null;
};

const formatData = (data: any | undefined): string => {
  if (data === undefined || data === null) return "";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return `(${data.map(formatData).join(", ")})`;
  return data.toString();
};

const Output = ({
  data,
  isTouched,
  isLoading,
  isError,
  error,
  isPrepareError,
  prepareError,
}: OutputProps) => {
  if (isLoading) return <span>loading...</span>;
  if (isTouched && isPrepareError)
    return (
      <span>
        {prepareError && prepareError.reason
          ? `Prepare Error: ${prepareError.reason}`
          : "Prepare Error"}
      </span>
    );
  if (isError && isTouched)
    return (
      <span>{error && error.reason ? `Error: ${error.reason}` : "Error"}</span>
    );
  return <span>{formatData(data)}</span>;
};

export default Output;
