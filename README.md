# seb3

## seb3-react is a Javascript package, built to simplify metamask wallet connection, detection of wallet address change and also detection of network changes.

To download the package: 
`npm install seb3-react` 


## Sample Usage


```javascript 

import React, { useEffect } from "react";
import { connectMetamask, onAddressChange, onChainChange } from "seb3-react";

function App() {
  useEffect(() => {
    // Connect to Metamask
    connectMetamask()
      .then((metamaskConnector) => {
        console.log("Metamask connected:", metamaskConnector);
      })
      .catch((error) => {
        console.error("Failed to connect to Metamask:", error);
      });

    // Listen for address changes
    onAddressChange((address) => {
      console.log("Address changed:", address);
    });

    // Listen for chain changes
    onChainChange((chainId) => {
      console.log("Chain changed:", chainId);
    });
  }, []);

  return (
    <div>
      {/* Your app components */}
    </div>
  );
}

export default App;

```
