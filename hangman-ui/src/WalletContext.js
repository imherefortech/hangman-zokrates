import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext({ 
  address: '',
  requestAddress: () => {}
});

export const WalletContextProvider = (props) => {
  const [state, setState] = useState({
    address: window?.ethereum?.selectedAddress,
    requestAddress: requestAddress
  })

  function requestAddress() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);

      provider.send("eth_requestAccounts", []).then(async () => {
        setState({ address: window.ethereum.selectedAddress })
      })
    } else {
        console.error("Web3 wallet not found!");
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      const timer = setTimeout(() => {
        setState({ address: window.ethereum.selectedAddress, requestAddress });
      }, 200);
      
      window.ethereum.on("accountsChanged", () => {
        setState({ address: window.ethereum.selectedAddress, requestAddress });
      });

      return () => clearTimeout(timer);
    }
  }, [window.ethereum]);

  return (
    <WalletContext.Provider value={state}>
      {props.children}
    </WalletContext.Provider>
  )
}