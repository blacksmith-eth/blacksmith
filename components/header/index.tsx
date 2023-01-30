import { WalletIcon } from "@heroicons/react/24/outline";
import { Connect } from "components/connect";
import Link from "next/link";

type HeaderProps = {
  toggleWallet: () => void;
  walletButtonText: string;
};

export const Header = ({ toggleWallet, walletButtonText }: HeaderProps) => (
  <header className="bg-white dark:bg-black border-b border-black dark:border-white sticky top-0 p-2 flex items-center justify-between">
    <h1 className="font-bold">
      <Link href="/" className="focus:underline focus:outline-none">
        Blacksmith
      </Link>
    </h1>
    <section className="flex items-center gap-1">
      <Connect />
      <button
        onClick={toggleWallet}
        className="p-0.5 text-black dark:text-white rounded-sm focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black focus:outline-none"
      >
        <WalletIcon className="w-6 h-6" />
        <span className="sr-only">{walletButtonText}</span>
      </button>
    </section>
  </header>
);
