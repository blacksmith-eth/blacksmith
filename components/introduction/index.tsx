import { Manager } from "./manager";
import { Setup } from "./setup";

export const Introduction = () => (
  <div className="flex flex-col gap-4">
    <Setup />
    <Manager />
  </div>
);
