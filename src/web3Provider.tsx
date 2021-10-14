import React from "react";
import Web3 from "web3";
import { abi } from "./data/abi.json";
import CONTRACT_ADDRESS from "./data/CONTRACT_ADDRESS";

export const Web3Context = React.createContext<{
  accounts?: string[];
  web3?: Web3;
  hasProvider?: boolean;
  initialize?: () => Promise<string[]>;
  getNamingBlocks?: () => Promise<{
    start: string;
    end: string;
    currentBlock: string;
  }>;
  getContract?: () => any;
}>({});

const lsKey = "ENABLED";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accounts, setAccounts] = React.useState<string[]>();
  const [initialized, updateInit] = React.useState(false);
  const provider =
    // @ts-ignore
    window["ethereum"] || (window.web3 && window.web3.currentProvider);
  let web3: any;
  if (provider) {
    web3 = new Web3(provider);
    // @ts-ignore
    window.web3 = web3;
  }

  React.useEffect(() => {
    if (accounts && !initialized) {
      const fn = async () => {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId != "0x1" && process.env.NODE_ENV === "production") {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
          });
        }
        function handleChainChanged(_chainId: string) {
          // We recommend reloading the page, unless you must do otherwise
          window.location.reload();
        }

        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("accountsChanged", handleChainChanged);

        updateInit(true);
      };
      fn();
    }
  }, [accounts, initialized]);

  const initialize = async () => {
    if (!web3) return;
    const accounts = await web3?.currentProvider?.request({
      method: "eth_requestAccounts",
    });
    setAccounts(accounts);
    if (window.localStorage) {
      window.localStorage.setItem(lsKey, "true");
    }

    return accounts;
  };

  if (
    web3 &&
    window.localStorage &&
    window.localStorage.getItem(lsKey) &&
    !accounts
  ) {
    initialize();
  }

  const getContract = () => {
    if (!web3) return;
    return new web3.eth.Contract(abi, CONTRACT_ADDRESS);
  };

  const getNamingBlocks = async () => {
    const contract = getContract();
    if (contract) {
      const [start, end, { number: currentBlock }] = await Promise.all([
        contract.methods.namingBlockStart().call(),
        contract.methods.namingBlockEnd().call(),
        web3.eth.getBlock("latest"),
      ]);
      return { start, end, currentBlock };
    } else {
      throw new Error("web3 not set");
    }
  };
  // @ts-ignore
  window.getContract = getContract;
  return (
    <Web3Context.Provider
      value={{
        hasProvider: !!provider,
        initialize,
        accounts,
        getContract,
        getNamingBlocks,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}
