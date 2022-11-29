import { ConnectButton } from "@rainbow-me/rainbowkit";

const Connect = () => {
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
                    className="border border-black dark:border-white px-2 py-0.5"
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
                    className="border border-black dark:border-white px-2 py-0.5"
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
                    className="bg-black dark:bg-white text-white dark:text-black rounded-l-sm px-2 py-0.5"
                  >
                    {chain.name === "Chain 31337" ? "Localhost" : chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="px-2 py-0.5 text-black dark:text-white"
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

export default Connect;
