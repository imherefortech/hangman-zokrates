import { ethers } from 'ethers';
import hangmanZokratesContract from '../contract-artifacts/hangman-zokrates-abi';
import config from '../config';

async function read(id) {
  const provider = getProvider();
  if (!provider) return null;

  const signer = await getSigner(provider);
  if (!signer) return null;

  const contract = new ethers.Contract(config.contractAddress, hangmanZokratesContract.abi, provider);
  const contractExists = await provider.getCode(config.contractAddress);
  if (contractExists === '0x') return null;
  
  const game = await contract.games(id);
  const attempts = await contract.gameAttempts(id);
  const word = await contract.gameWord(id);
  const secretWordHash = await contract.secretWordHash(id);
  
  return {
    id,
    length: Number(game.getValue('length')),
    isGuesserTurn: game.getValue('guesserTurn'),
    attempts: attempts.map(a => Number(a)),
    word: word.map(l => Number(l)),
    secretWordHash: secretWordHash.map(l => Number(l)),
    host: game.getValue('host').toLowerCase()
  };
}

function getProvider() {
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  } else {
    return null;
  }
}

async function getSigner(provider) {
  if (await provider.hasSigner()) {
    return await provider.getSigner();
  } else {
    return null;
  }
}

export default { read };