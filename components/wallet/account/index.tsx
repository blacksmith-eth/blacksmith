import { Listbox } from "@headlessui/react";
import { Address } from "core/types";
import { BlacksmithConnector } from "packages/core/connector";
import { PropsWithChildren, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";

const formatAddress = (address?: Address) => {
  if (!address) return "No active address";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const formatValue = (value: string) => value.slice(0, value.indexOf(".") + 2);

type OptionProps = PropsWithChildren<{ address: Address }>;

const Option = ({ address, children }: OptionProps) => {
  const { data } = useBalance({ address });
  return (
    <Listbox.Option
      value={address}
      className={({ active }) =>
        `${active ? "bg-black text-white" : ""} px-2 py-1`
      }
    >
      {children}
      {data && ` | ${formatValue(data.formatted)} ${data.symbol}`}
    </Listbox.Option>
  );
};

export const Account = () => {
  const [accounts, setAccounts] = useState<Address[]>([]);
  const { address, connector } = useAccount();
  const { data: balance } = useBalance({ address });

  useEffect(() => {
    if (connector && connector instanceof BlacksmithConnector) {
      connector.listAccounts().then(setAccounts);
    }
  }, [connector]);

  const setAddress = (address: string) => {
    if (connector && connector instanceof BlacksmithConnector) {
      connector.changeAccount(address);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-bold">Change Account</h2>
      <section className="flex flex-col gap-2 font-mono">
        <Listbox value={address} onChange={setAddress}>
          <Listbox.Label className="sr-only">account</Listbox.Label>
          <div className="relative text-right select-none text-sm">
            <Listbox.Button className="text-left border border-black dark:border-white h-full w-full px-2 py-1">
              {formatAddress(address)}
              {balance &&
                ` | ${formatValue(balance.formatted)} ${balance.symbol}`}
            </Listbox.Button>
            <Listbox.Options className="text-left w-full bg-white dark:bg-black border border-black dark:border-white absolute mt-1 right-0 focus:outline-none">
              {accounts.map((address) => (
                <Option key={address} address={address}>
                  {formatAddress(address)}
                </Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </section>
    </div>
  );
};
