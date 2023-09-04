import './Web3Connect.css';
import { useContext } from 'react';
import Select from 'react-select'
import { WalletContext } from '../WalletContext';
import config from '../config';

export default function Web3Connect() {
  const { address, chainId, requestAddress, requestChain } = useContext(WalletContext);

  const chainOptions = config.chains
    .map(c => { return { value: c.chainId, label: c.chainName }; });
  const selected = chainOptions.find(o => o.value === chainId);

  function onSelectChain(option) {
    requestChain(option.value);
  }
  
  return <div className="account-block">
    <Select className="chain-select" options={chainOptions} isSearchable={false} onChange={onSelectChain} value={selected || ''} placeholder={'Wrong Network'} />
    { address
      ? <div className="address">{address}</div>
      : <button className="connect-button" onClick={requestAddress}>Connect Wallet</button>
    }
  </div>
}