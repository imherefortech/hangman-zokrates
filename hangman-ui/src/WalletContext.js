import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import config from './config';

export const WalletContext = createContext({ 
  address: '',
  displayAddress: '',
  chainId: null,
  requestAddress: () => {},
  requestChain: () => {}
});

const browserProvider = new ethers.BrowserProvider(window.ethereum);
const ethProvider = new ethers.getDefaultProvider(config.ethRpc);

export const WalletContextProvider = (props) => {
  const [requestMethods, _] = useState({
    requestAddress,
    requestChain
  });
  const [chainId, setChainId] = useState(window.ethereum?.chainId);
  const [addressState, setAddressState] = useState({
    address: window.ethereum?.selectedAddress,
    displayAddress: window.ethereum?.selectedAddress
  });

  function requestAddress() {
    if (window.ethereum) {
      browserProvider.send("eth_requestAccounts", []);
    } else {
        console.error("Web3 wallet not found!");
    }
  }

  function requestChain(chainId) {
    if (window.ethereum) {
      browserProvider.send("wallet_switchEthereumChain", [{ chainId }]).catch((ex) => {
        if (ex.error.code === 4902) {
          const chain = config.chains.find(c => Number(c.chainId) === Number(chainId));
          browserProvider.send("wallet_addEthereumChain", [chain]);
        }
      });
    } else {
      console.error("Web3 wallet not found!");
    }
  }

  async function updateDisplayAddress(address) {
    const displayAddress = address
      ? await ethProvider.lookupAddress(address) ?? address
      : '';
    setAddressState({ address, displayAddress });
  }

  useEffect(() => {
    if (window.ethereum) {
      const timer = setTimeout(async () => {
        setChainId(window.ethereum.chainId);
        await updateDisplayAddress(window.ethereum.selectedAddress);
      }, 200);
      
      window.ethereum.on("chainChanged", (chainId) => {
        setChainId(chainId);
      });
      
      window.ethereum.on("accountsChanged", async (accounts) => {
        await updateDisplayAddress(accounts[0]);
      });

      return () => clearTimeout(timer);
    }
  }, [window.ethereum]);

  return (
    <WalletContext.Provider value={{...requestMethods, chainId, ...addressState}}>
      {props.children}
    </WalletContext.Provider>
  )
}