import { useState } from "react";

const Setup = () => {
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

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeployerAddress(event.target.value);
  };

  const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPath(event.target.value);
  };

  const handleContractNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractName(event.target.value);
  };

  const handleRpcUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRpcUrl(event.target.value);
  };

  const handleVerifierUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerifierUrl(event.target.value);
  };

  const preventDefault = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const focusedClasses = "font-bold underline";

  return (
    <div className="flex flex-col">
      <h3 className="font-bold text-2xl">Getting Started</h3>
      <p>
        To get started, you will need to deploy a contract to a local testnet
        node like{" "}
        <a
          href="https://github.com/foundry-rs/foundry/tree/master/anvil"
          className="underline"
        >
          Anvil
        </a>
        .
      </p>
      <p>
        You can use the form below to generate the necessary{" "}
        <a
          href="https://github.com/foundry-rs/foundry/tree/master/forge"
          className="underline"
        >
          Forge
        </a>{" "}
        command to deploy your contract to the local testnet and see it appear
        in Blacksmith.
      </p>
      <p>
        In most cases you will only need to change the{" "}
        <span className="italic">path</span> and{" "}
        <span className="italic">contract name</span> fields.
      </p>
      <form onSubmit={preventDefault} onBlur={() => setFocusedInput("")}>
        <div className="flex flex-col">
          <label htmlFor="path">path</label>
          <input
            id="path"
            type="text"
            className="border"
            value={path}
            onChange={handlePathChange}
            onFocus={() => setFocusedInput("path")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="contractName">contract name</label>
          <input
            id="contractName"
            type="text"
            className="border"
            value={contractName}
            onChange={handleContractNameChange}
            onFocus={() => setFocusedInput("contractName")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="deployerAddress">deployer address</label>
          <input
            id="deployerAddress"
            type="text"
            className="border"
            value={deployerAddress}
            onChange={handleAddressChange}
            onFocus={() => setFocusedInput("deployerAddress")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="rpcUrl">rpc url</label>
          <input
            id="rpcUrl"
            type="text"
            className="border"
            value={rpcUrl}
            onChange={handleRpcUrlChange}
            onFocus={() => setFocusedInput("rpcUrl")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="verifierUrl">verifier url</label>
          <input
            id="verifierUrl"
            type="text"
            className="border"
            value={verifierUrl}
            onChange={handleVerifierUrlChange}
            onFocus={() => setFocusedInput("verifierUrl")}
          />
        </div>
      </form>
      <div>
        <div>
          {`forge create `}
          <span className={`${focusedInput === "path" ? focusedClasses : ""}`}>
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
          {` --verify --unlocked \\`}
        </div>
        <div>
          {`--from `}
          <span
            className={`${
              focusedInput === "deployerAddress" ? focusedClasses : ""
            }`}
          >
            {deployerAddress}
          </span>
          {` \\`}
        </div>
        <div>
          {`--rpc-url `}
          <span
            className={`${focusedInput === "rpcUrl" ? focusedClasses : ""}`}
          >
            {rpcUrl}
          </span>
          {` \\`}
        </div>
        <div>
          {`--verifier-url `}
          <span
            className={`${
              focusedInput === "verifierUrl" ? focusedClasses : ""
            }`}
          >
            {verifierUrl}
          </span>
          {` \\`}
        </div>
        <div>{`--etherscan-api-key blacksmith`}</div>
      </div>
    </div>
  );
};

export default Setup;
