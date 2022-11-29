import {
  ArchiveBoxXMarkIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import Field from "components/field";
import { useState } from "react";
import { useSWRConfig } from "swr";

const Manager = () => {
  const [address, setAddress] = useState("");
  const [etherscanApiKey, setEtherscanApiKey] = useState("");
  const { mutate } = useSWRConfig();

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleEtherscanApiKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEtherscanApiKey(event.target.value);
  };

  const handleImport = () => {
    fetch(`/api/contracts/${address}`, {
      method: "POST",
      body: JSON.stringify({ key: etherscanApiKey }),
    }).then(() => mutate("/api/contracts"));
  };

  const handleRemove = () => {
    fetch(`/api/contracts/${address}`, {
      method: "DELETE",
    }).then(() => mutate("/api/contracts"));
  };

  const handleRemoveAll = () => {
    fetch(`/api/contracts`, {
      method: "DELETE",
    }).then(() => mutate("/api/contracts"));
  };

  return (
    <div className="flex flex-col">
      <h3 className="font-bold text-2xl">Contract Management</h3>
      <div className="flex flex-col gap-2">
        <div>
          <p>
            You can remove any contract from Blacksmith that you have imported
            or verified without an Etherscan API key.
          </p>
          <p>
            You can import verified contracts from Etherscan by providing a
            contract address and an Etherscan API key.
          </p>
          <p>
            You can interact with imported contracts by starting an instance of
            Anvil that{" "}
            <a
              href="https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil"
              className="underline"
            >
              forks mainnet
            </a>
            .
          </p>
        </div>
        <Field
          inputName="contract address"
          value={address}
          type="address"
          id="address"
          handleChange={handleAddressChange}
        />
        <Field
          inputName="etherscan api key"
          value={etherscanApiKey}
          type="string"
          id="etherscan-api-key"
          handleChange={handleEtherscanApiKeyChange}
        />
        <div className="flex flex-row gap-2">
          <button
            onClick={handleImport}
            className="self-start flex items-center gap-1 border border-black px-1.5 py-0.5 rounded"
          >
            <span className="text-sm">import</span>
            <PlusSmallIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleRemove}
            className="self-start flex items-center gap-1 border border-black px-1.5 py-0.5 rounded"
          >
            <span className="text-sm">remove</span>
            <ArchiveBoxXMarkIcon className="h-4 w-4" />
          </button>
        </div>
        <h4 className="font-bold">Danger Zone</h4>
        <button
          onClick={handleRemoveAll}
          className="self-start flex items-center gap-1 border border-black px-1.5 py-0.5 rounded"
        >
          <span className="text-sm">remove all</span>
          <ArchiveBoxXMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Manager;
