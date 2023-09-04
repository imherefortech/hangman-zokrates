import './Web3Connect.css';
import { useContext } from 'react';
import { WalletContext } from '../WalletContext';

export default function Web3Connect() {
  const { address, requestAddress } = useContext(WalletContext);

  return <div className="account-block">
    { address
      ? <div>
          <div className="address">{address}</div>
        </div>
      : <button className="connect-button" onClick={requestAddress}>Connect Wallet</button>
    }
  </div>
}