import "styles/globals.css";
import { Inter, Source_Code_Pro } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { ThemeProvider } from "next-themes";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { blacksmithWallet } from "packages/wallets";
import { forkedChains, foundry } from "core/chains";
import { Layout } from "components/layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

const { chains, provider, webSocketProvider } = configureChains(
  [foundry, ...forkedChains],
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

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className={`${inter.variable} ${sourceCodePro.variable} font-sans`}>
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  </div>
);

export default MyApp;
