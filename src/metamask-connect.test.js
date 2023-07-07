import { MockedProvider, resetMocks } from "depay-web3-mock";

import {
  connectMetamask,
  onAddressChange,
  onChainChange,
} from "./metamask-connect";

describe("Metamask Connector", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("should connect to Metamask", async () => {
    const mockAccounts = ["0x1234567890abcdef"];
    const mockChainId = "0x1";

    MockedProvider.enable();
    MockedProvider.injectAccounts(mockAccounts);
    MockedProvider.injectChainId(mockChainId);

    const metamaskConnector = await connectMetamask();

    expect(metamaskConnector).toEqual({
      connected: true,
      currentAddress: "0x1234567890abcdef",
      currentChainId: "0x1",
      listeners: {
        addressChanged: [],
        chainChanged: [],
      },
    });

    MockedProvider.disable();
  });

  it("should handle address change", () => {
    const mockCallback = jest.fn();
    onAddressChange(mockCallback);

    const newAddress = "0x9876543210fedcba";
    MockedProvider.injectAccounts([newAddress]);

    expect(mockCallback).toHaveBeenCalledWith(newAddress);
  });

  it("should handle chain change", () => {
    const mockCallback = jest.fn();
    onChainChange(mockCallback);

    const newChainId = "0x2";
    MockedProvider.injectChainId(newChainId);

    expect(mockCallback).toHaveBeenCalledWith(newChainId);
  });
});
