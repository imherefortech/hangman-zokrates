import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import config from './config';

export const WalletContext = createContext({ 
  address: '',
  chainId: null,
  requestAddress: () => {},
  requestChain: () => {}
});

export const WalletContextProvider = (props) => {
  const [state, setState] = useState({
    address: window?.ethereum?.selectedAddress,
    chainId: window?.ethereum?.chainId,
    requestAddress,
    requestChain
  });

  function updateState(ethereum) {
    const chain = config.chains.find(c => Number(c.chainId) === Number(ethereum.chainId));
    
    setState({
      address: ethereum.selectedAddress,
      chainId: chain?.chainId,
      requestAddress,
      requestChain
    });
  }

  function requestAddress() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.send("eth_requestAccounts", []).then(async () => {
        updateState(window.ethereum);
      })
    } else {
        console.error("Web3 wallet not found!");
    }
  }

  function requestChain(chainId) {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      provider.send("wallet_switchEthereumChain", [{ chainId }]).catch((ex) => {
        if (ex.error.code === 4902) {
          const chain = config.chains.find(c => Number(c.chainId) === Number(chainId));
          provider.send("wallet_addEthereumChain", [chain]);
        }
      });
    } else {
      console.error("Web3 wallet not found!");
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      const timer = setTimeout(() => {
        updateState(window.ethereum);;
      }, 200);
      
      window.ethereum.on("chainChanged", () => {
        updateState(window.ethereum);;
      });
      
      window.ethereum.on("accountsChanged", () => {
        updateState(window.ethereum);;
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