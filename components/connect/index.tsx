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
                  <button onClick={openConnectModal} type="button">
                    connect wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    wrong network
                  </button>
                );
              }
              return (
                <div className="flex rounded border border-slate-300 divide-x divide-slate-300 divide-solid">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="bg-slate-100 rounded-l px-2 py-0.5"
                  >
                    {chain.name === "Chain 31337" ? "Localhost" : chain.name}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="px-2 py-0.5"
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
