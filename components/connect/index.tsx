import { ConnectButton } from "@rainbow-me/rainbowkit";

type Account = {
  address: string;
  balanceDecimals?: number | undefined;
  balanceFormatted?: string | undefined;
  balanceSymbol?: string | undefined;
  displayBalance?: string | undefined;
  displayName: string;
  ensAvatar?: string | undefined;
  ensName?: string | undefined;
  hasPendingTransactions: boolean;
};

type Chain = {
  hasIcon: boolean;
  iconUrl?: string | undefined;
  iconBackground?: string | undefined;
  id: number;
  name?: string | undefined;
  unsupported?: boolean | undefined;
};

type ConnectWalletButtonProps = {
  openConnectModal: () => void;
};

const ConnectWalletButton = ({
  openConnectModal,
}: ConnectWalletButtonProps) => (
  <button
    onClick={openConnectModal}
    type="button"
    className="border border-black dark:border-white px-2 py-0.5 focus:italic focus:outline-none"
  >
    connect wallet
  </button>
);

type WrongNetworkButtonProps = {
  openChainModal: () => void;
};

const WrongNetworkButton = ({ openChainModal }: WrongNetworkButtonProps) => (
  <button
    onClick={openChainModal}
    type="button"
    className="border border-black dark:border-white px-2 py-0.5 focus:italic focus:outline-none"
  >
    wrong network
  </button>
);

type ConnectedButtonProps = {
  account: Account;
  chain: Chain;
  openAccountModal: () => void;
  openChainModal: () => void;
};

const ConnectedButton = ({
  account,
  chain,
  openAccountModal,
  openChainModal,
}: ConnectedButtonProps) => (
  <div className="flex rounded border border-black dark:border-white divide-x divide-black dark:divide-white divide-solid">
    <button
      onClick={openChainModal}
      type="button"
      className="bg-black dark:bg-white text-white dark:text-black rounded-l-sm px-2 py-0.5 focus:italic focus:outline-none"
    >
      {chain.name}
    </button>
    <button
      onClick={openAccountModal}
      type="button"
      className="px-2 py-0.5 text-black dark:text-white focus:italic focus:outline-none"
    >
      {account.displayName}
    </button>
  </div>
);

export const Connect = () => (
  <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      authenticationStatus,
      mounted,
    }) => {
      const ready = mounted && authenticationStatus !== "loading";
      const connected =
        ready &&
        account &&
        chain &&
        (!authenticationStatus || authenticationStatus === "authenticated");
      return (
        <div
          {...(!ready && {
            "aria-hidden": true,
            style: {
              opacity: 0,
              pointerEvents: "none",
              userSelect: "none",
            },
          })}
        >
          {(() => {
            if (!connected) {
              return (
                <ConnectWalletButton openConnectModal={openConnectModal} />
              );
            }
            if (chain.unsupported) {
              return <WrongNetworkButton openChainModal={openChainModal} />;
            }
            return (
              <ConnectedButton
                account={account}
                chain={chain}
                openAccountModal={openAccountModal}
                openChainModal={openChainModal}
              />
            );
          })()}
        </div>
      );
    }}
  </ConnectButton.Custom>
);
