import "styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  connectorsForWallets,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { ThemeProvider } from "next-themes";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { blacksmithWallet } from "packages/wallets";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.localhost],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Blacksmith",
    wallets: [blacksmithWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange={true}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          appInfo={{
            appName: "Blacksmith",
            learnMoreUrl: "https://github.com/blacksmith-eth/blacksmith",
          }}
          chains={chains}
          theme={{
            darkMode: darkTheme({
              accentColor: "#ebddd1",
              accentColorForeground: "#262a33",
              borderRadius: "small",
            }),
            lightMode: lightTheme({
              accentColor: "#262a33",
              accentColorForeground: "#ebddd1",
              borderRadius: "small",
            }),
          }}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default MyApp;
