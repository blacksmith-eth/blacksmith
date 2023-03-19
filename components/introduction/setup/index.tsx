import { Square2StackIcon } from "@heroicons/react/24/outline";
import { Anchor } from "components/anchor";
import { Field } from "components/field";
import { ChangeEvent, useState } from "react";

export const Setup = () => {
  const [focusedInput, setFocusedInput] = useState("");
  const [deployerAddress, setDeployerAddress] = useState<string>(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
  const [path, setPath] = useState("src/Counter.sol");
  const [contractName, setContractName] = useState("Counter");
  const [rpcUrl, setRpcUrl] = useState("http://localhost:8545");
  const [verifierUrl, setVerifierUrl] = useState(
    "http://localhost:3000/api/verify"
  );
  const command = `forge create ${path}:${contractName} --verify --unlocked --from ${deployerAddress} --rpc-url ${rpcUrl} --verifier-url ${verifierUrl} --etherscan-api-key blacksmith`;

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDeployerAddress(event.target.value);
  };

  const handlePathChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPath(event.target.value);
  };

  const handleContractNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setContractName(event.target.value);
  };

  const handleRpcUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRpcUrl(event.target.value);
  };

  const handleVerifierUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifierUrl(event.target.value);
  };

  const focusedClasses = "font-bold underline";

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(command);
  };

  return (
    <div className="flex flex-col">
      <h3 className="font-bold text-2xl">Getting Started</h3>
      <div className="flex flex-col gap-2">
        <p className="max-w-prose">
          To get started, you will need to deploy a contract to a local testnet
          node like{" "}
          <Anchor href="https://github.com/foundry-rs/foundry/tree/master/anvil">
            Anvil
          </Anchor>
          . You can use the form below to generate the necessary{" "}
          <Anchor href="https://github.com/foundry-rs/foundry/tree/master/forge">
            Forge
          </Anchor>{" "}
          command to deploy your contract to the local testnet and see it appear
          in Blacksmith. In most cases you will only need to change the{" "}
          <span className="italic">path</span> and{" "}
          <span className="italic">contract name</span> fields.
        </p>
        <form onBlur={() => setFocusedInput("")}>
          <ul className="flex flex-col gap-2">
            <Field
              id="path"
              inputName="path"
              type="string"
              value={path}
              handleChange={handlePathChange}
              onFocus={() => setFocusedInput("path")}
            />
            <Field
              id="contractName"
              inputName="contract name"
              type="string"
              value={contractName}
              handleChange={handleContractNameChange}
              onFocus={() => setFocusedInput("contractName")}
            />
            <Field
              id="deployerAddress"
              inputName="deployer address"
              type="address"
              value={deployerAddress}
              handleChange={handleAddressChange}
              onFocus={() => setFocusedInput("deployerAddress")}
            />
            <Field
              id="rpcUrl"
              inputName="rpc url"
              type="string"
              value={rpcUrl}
              handleChange={handleRpcUrlChange}
              onFocus={() => setFocusedInput("rpcUrl")}
            />
            <Field
              id="verifierUrl"
              inputName="verifier url"
              type="string"
              value={verifierUrl}
              handleChange={handleVerifierUrlChange}
              onFocus={() => setFocusedInput("verifierUrl")}
            />
          </ul>
        </form>
        <div className="flex items-start justify-between font-mono text-sm p-4 text-black dark:text-black bg-slate-100 dark:bg-slate-100 rounded border border-slate-200 dark:border-slate-200">
          <div>
            <div>
              {"forge create "}
              <span
                className={`${focusedInput === "path" ? focusedClasses : ""}`}
              >
                {path}
              </span>
              :
              <span
                className={`${
                  focusedInput === "contractName" ? focusedClasses : ""
                }`}
              >
                {contractName}
              </span>
              {" --verify --unlocked \\"}
            </div>
            <div>
              {"--from "}
              <span
                className={`${
                  focusedInput === "deployerAddress" ? focusedClasses : ""
                }`}
              >
                {deployerAddress}
              </span>
              {" \\"}
            </div>
            <div>
              {"--rpc-url "}
              <span
                className={`${focusedInput === "rpcUrl" ? focusedClasses : ""}`}
              >
                {rpcUrl}
              </span>
              {" \\"}
            </div>
            <div>
              {"--verifier-url "}
              <span
                className={`${
                  focusedInput === "verifierUrl" ? focusedClasses : ""
                }`}
              >
                {verifierUrl}
              </span>
              {" \\"}
            </div>
            <div>{"--etherscan-api-key blacksmith"}</div>
          </div>
          <button
            className="text-black focus:outline-none border border-black rounded p-2 focus:bg-black focus:text-white"
            onClick={handleCopyCommand}
          >
            <span className="sr-only">Copy Command</span>
            <Square2StackIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
