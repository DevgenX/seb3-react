import { connectMetamask, onAddressChange, onChainChange } from "./index";
import { JSDOM } from "jsdom";

describe("Metamask Connector", () => {
  let window: any;

  beforeEach(() => {
    const dom = new JSDOM();
    window = dom.window;
    global.window = window;
    window.ethereum = {
      request: jest.fn(),
      on: jest.fn(),
    };
  });

  afterEach(() => {
    window = undefined;
  });

  it("should connect to Metamask", async () => {
    const mockAccounts = ["0x1234567890abcdef"];

    // Mock the necessary Metamask API calls
    (window.ethereum.request as jest.Mock).mockResolvedValueOnce(mockAccounts);
    (window.ethereum.on as jest.Mock).mockImplementationOnce(
      (event: string, callback: Function) => {
        if (event === "accountsChanged") {
          callback(["0x9876543210fedcba"]);
        }
      }
    );

    const metamaskConnector = await connectMetamask();

    expect(metamaskConnector).toEqual({
      connected: true,
      currentAddress: "0x1234567890abcdef",
      currentChainId: null,
    });
  });

  it("should handle address change", () => {
    const mockCallback = jest.fn();

    onAddressChange(mockCallback);

    // Trigger address change event
    (window.ethereum.on as jest.Mock).mock.calls[0][1](["0x1234567890abcdef"]);

    expect(mockCallback).toHaveBeenCalledWith("0x1234567890abcdef");
  });

  it("should handle chain change", () => {
    const mockCallback = jest.fn();

    onChainChange(mockCallback);

    // Trigger chain change event
    (window.ethereum.on as jest.Mock).mock.calls[1][1]("0x1");

    expect(mockCallback).toHaveBeenCalledWith("0x1");
  });
});
