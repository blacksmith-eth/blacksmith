import Account from "./account";
import Transfer from "./transfer";

type WalletProps = {
  open: boolean;
};

const Wallet = ({ open }: WalletProps) => {
  if (!open) return <></>;
  return (
    <aside className="z-30 bg-white border-l border-black p-2 fixed right-0 h-full w-full lg:w-96 overflow-y-auto overscroll-none">
      <div className="flex flex-col gap-2">
        <Transfer />
        <Account />
      </div>
    </aside>
  );
};

export default Wallet;
