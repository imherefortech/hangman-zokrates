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
  const [state, setState] = useState({
    address: window.ethereum?.selectedAddress,
    chainId: window.ethereum?.chainId,
    displayAddress: window.ethereum?.selectedAddress,
    requestAddress,
    requestChain
  });

  function updateState(stateUpdate) {
    const chainId = stateUpdate.chainId ?? state.chainId;
    const chain = config.chains.find(c => Number(c.chainId) === Number(chainId));

    const address = stateUpdate.address ?? state.address;
    const displayAddress = stateUpdate.displayAddress ?? address;
    
    setState({
      address: address,
      chainId: chain?.chainId,
      displayAddress: displayAddress,
      requestAddress,
      requestChain
    });
  }

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
      ? await ethProvider.lookupAddress(address)
      : '';
    updateState({ address, displayAddress });
  }

  useEffect(() => {
    if (window.ethereum) {
      const timer = setTimeout(async () => {
        updateState({ address: window.ethereum.selectedAddress, chainId: window.ethereum.chainId });
        await updateDisplayAddress(window.ethereum.selectedAddress);
      }, 200);
      
      window.ethereum.on("chainChanged", (chainId) => {
        updateState({ chainId: chainId });
      });
      
      window.ethereum.on("accountsChanged", async (accounts) => {
        updateState({ address: accounts[0] });
        await updateDisplayAddress(accounts[0]);
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