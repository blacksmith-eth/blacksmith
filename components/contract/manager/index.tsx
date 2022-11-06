import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import Field from "components/field";
import { useState } from "react";
import { useSWRConfig } from "swr";

const Manager = () => {
  const [address, setAddress] = useState("");
  const { mutate } = useSWRConfig();

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleRemove = () => {
    fetch(`/api/contracts/${address}`, {
      method: "DELETE",
    }).then(() => mutate("/api/contracts"));
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-2xl">Contract Management</h3>
      <Field
        inputName="contract address"
        value={address}
        type="address"
        id="address"
        handleChange={handleAddressChange}
      />
      <button
        onClick={handleRemove}
        className="self-start flex items-center gap-1 border px-1.5 py-0.5 rounded"
      >
        <span className="text-sm">remove</span>
        <ArchiveBoxXMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Manager;
