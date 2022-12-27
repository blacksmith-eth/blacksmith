import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Connect = () => {
  return (
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
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="border border-black dark:border-white px-2 py-0.5 focus:italic focus:outline-none"
                  >
                    connect wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="border border-black dark:border-white px-2 py-0.5 focus:italic focus:outline-none"
                  >
                    wrong network
                  </button>
                );
              }
              return (
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
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
