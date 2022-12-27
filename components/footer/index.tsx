import { Anchor } from "components/anchor";
import { Switch } from "components/switch";

export const Footer = () => (
  <footer className="flex flex-col">
    <Switch />
    <div className="text-sm px-1.5">
      <span>
        Created by{" "}
        <Anchor href="https://twitter.com/0xholypanda">0xholypanda</Anchor>
      </span>
      <span> | </span>
      <Anchor href="https://github.com/blacksmith-eth/blacksmith">
        star on github
      </Anchor>
      <span> | </span>
      <Anchor href="https://github.com/blacksmith-eth/blacksmith/issues/new/choose">
        report an issue
      </Anchor>
    </div>
  </footer>
);
