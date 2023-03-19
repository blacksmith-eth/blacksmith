import {
  ArchiveBoxXMarkIcon,
  PlusSmallIcon,
} from "@heroicons/react/24/outline";
import { Anchor } from "components/anchor";
import { Field } from "components/field";
import { useContracts } from "hooks";
import {
  ButtonHTMLAttributes,
  ChangeEvent,
  DetailedHTMLProps,
  useState,
} from "react";

type IconButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const IconButton = ({ children, ...props }: IconButtonProps) => (
  <button
    {...props}
    className="self-start flex items-center gap-1 border border-black dark:border-white hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none px-1.5 py-0.5 rounded"
  >
    {children}
  </button>
);

export const Manager = () => {
  const [response, setResponse] = useState("");
  const [deleteAllResponse, setDeleteAllResponse] = useState("");
  const [address, setAddress] = useState("");
  const { mutate } = useContracts();

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleImport = () => {
    fetch(`/api/contracts/${address}`, {
      method: "POST",
    }).then((response) => {
      const responseMessage = response.ok
        ? "Imported successfully"
        : "Import failed";
      setResponse(responseMessage);
      mutate();
    });
  };

  const handleRemove = () => {
    fetch(`/api/contracts/${address}`, {
      method: "DELETE",
    }).then((response) => {
      const responseMessage = response.ok
        ? "Removed successfully"
        : "Remove failed";
      setResponse(responseMessage);
      mutate();
    });
  };

  const handleRemoveAll = () => {
    fetch("/api/contracts", {
      method: "DELETE",
    }).then(() => {
      setDeleteAllResponse("Removed all contracts");
      mutate();
    });
  };

  return (
    <div className="flex flex-col">
      <h3 className="font-bold text-2xl">Contract Management</h3>
      <div className="flex flex-col gap-2">
        <p className="max-w-prose">
          You can remove any contract from Blacksmith that you have imported or
          verified. You can import verified contracts from Etherscan (currently
          Ethereum mainnet only) by providing a contract address. You can
          interact with imported contracts by starting an instance of Anvil that{" "}
          <Anchor href="https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil">
            forks mainnet
          </Anchor>
          . To avoid rate limits read the Advanced Usage section of the
          Blacksmith README.
        </p>
        <ul>
          <Field
            inputName="contract address"
            value={address}
            type="address"
            id="address"
            handleChange={handleAddressChange}
          />
        </ul>
        <div className="flex flex-row gap-2">
          <IconButton onClick={handleImport}>
            <span className="text-sm">import</span>
            <PlusSmallIcon className="w-4 h-4" />
          </IconButton>
          <IconButton onClick={handleRemove}>
            <span className="text-sm">remove</span>
            <ArchiveBoxXMarkIcon className="h-4 w-4" />
          </IconButton>
          <span>{response}</span>
        </div>
        <span className="italic">
          The ability to import contracts from other chains is coming soon.
        </span>
        <h4 className="font-bold">Danger Zone</h4>
        <div className="flex flex-row gap-2">
          <IconButton onClick={handleRemoveAll}>
            <span className="text-sm">remove all</span>
            <ArchiveBoxXMarkIcon className="h-4 w-4" />
          </IconButton>
          <span>{deleteAllResponse}</span>
        </div>
      </div>
    </div>
  );
};
