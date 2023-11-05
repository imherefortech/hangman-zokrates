import { ethers } from 'ethers';
import hangmanNoirContract from '../../contract-artifacts/hangman-noir-abi';
import config from '../../config';
import proofGeneration from './proof-generation-noir';
import utils from '../../utils';

async function generateNewGameProof(word, statusCallback) {
  return await proofGeneration.generateProof(buildWitnessInput(word, " "), statusCallback);
}

async function generateLetterProof(word, letter, statusCallback) {
  return await proofGeneration.generateProof(buildWitnessInput(word, letter), statusCallback);
}

function buildWitnessInput(word, letter) {
  const paddedWord = word.padEnd(16, ' ');
  const hash = utils.sha256Noir(paddedWord);
  const symbol = letter.charCodeAt(0);
  
  return Array.from(paddedWord)
    .map(l => l.charCodeAt(0))
    .concat(hash)
    .concat([symbol]);
}

async function createGame(proof) {
  const signer = await connectWallet();

  const tx = await getContract(signer).createGame(proof.slice(49*32), [proof.slice(0, 49*32)]);
  const receipt = await tx.wait();

  const gameId = receipt.logs[0].topics[1];

  return gameId;
}

async function suggestLetter(gameId, letter) {
  const signer = await connectWallet();

  const tx = await getContract(signer).guessLetter(gameId, letter);
  await tx.wait();
}

async function verifyLetter(proof, gameId) {
  const signer = await connectWallet();

  const tx = await getContract(signer).verifyLetter(proof.slice(49*32), [proof.slice(0, 49*32)], gameId);
  await tx.wait();
}

function getContract(signer) {
  return new ethers.Contract(config.contractAddress, hangmanNoirContract.abi, signer);
}

async function connectWallet() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
}

export default {
  generateLetterProof,
  generateNewGameProof,
  createGame,
  suggestLetter,
  verifyLetter
};