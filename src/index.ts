import Web3 from "web3";

interface MetamaskConnector {
  connected: boolean;
  currentAddress: string | null;
  currentChainId: bigint | string | null;
  listeners: {
    addressChanged: Array<(address: string) => void>;
    chainChanged: Array<(chainId: string) => void>;
  };
}

const metamaskConnector: MetamaskConnector = {
  connected: false,
  currentAddress: null,
  currentChainId: null,
  listeners: {
    addressChanged: [],
    chainChanged: [],
  },
};

export async function connectMetamask(): Promise<MetamaskConnector | null> {
  try {
    if (typeof window === "undefined" || (!window as any).ethereum) {
      throw new Error("Metamask not found.");
    }

    await (window as any).ethereum.request({ method: "eth_requestAccounts" });

    const web3 = new Web3((window as any).ethereum);
    const currentAddress = (await web3.eth.getAccounts())[0];
    const currentChainId = await web3.eth.getChainId();

    metamaskConnector.connected = true;
    metamaskConnector.currentAddress = currentAddress;
    metamaskConnector.currentChainId = currentChainId;

    (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
      const newAddress = accounts[0];
      if (newAddress !== metamaskConnector.currentAddress) {
        metamaskConnector.currentAddress = newAddress;
        metamaskConnector.listeners.addressChanged.forEach((callback) =>
          callback(newAddress)
        );
      }
    });

    (window as any).ethereum.on("chainChanged", (chainId: string) => {
      if (chainId !== metamaskConnector.currentChainId) {
        metamaskConnector.currentChainId = chainId;
        metamaskConnector.listeners.chainChanged.forEach((callback) =>
          callback(chainId)
        );
      }
    });

    return metamaskConnector;
  } catch (error) {
    console.error("Failed to connect to Metamask:", error);
    return null;
  }
}

export function onAddressChange(callback: (address: string) => void) {
  metamaskConnector.listeners.addressChanged.push(callback);
}

export function onChainChange(callback: (chainId: string) => void) {
  metamaskConnector.listeners.chainChanged.push(callback);
}
