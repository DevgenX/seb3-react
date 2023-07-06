declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>;
      on?: (event: string, listener: (arg: any) => void) => void;
      removeListener?: (event: string, listener: (arg: any) => void) => void;
    };
  }
}
