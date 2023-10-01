import { ethers } from 'ethers';
import hangmanZokratesContract from '../../contract-artifacts/hangman-zokrates-abi';
import config from '../../config';
import proofGeneration from './proof-generation-zokrates';
import utils from '../../utils';

async function generateNewGameProof(word, statusCallback) {
  return await proofGeneration.generateProof(buildWitnessInput(word, "0"), statusCallback);
}

async function generateLetterProof(word, letter, statusCallback) {
  return await proofGeneration.generateProof(buildWitnessInput(word, letter), statusCallback);
}

function buildWitnessInput(word, symbol) {
    const input = [[]];

    // First input is a padded word
    for (let i = 0; i < 16; i++) {
        input[0].push(word[i] === undefined ? "0" : word[i].charCodeAt(0).toString());
    }

    // Second input is a hashed word
    const hashedWord = utils.paddedHash(word);
    input.push(hashedWord);

    // Third input is a character we are verifying (0 for new game)
    input.push(symbol);
    return input;
}

async function createGame(proof) {
  const signer = await connectWallet();

  const tx = await getContract(signer).createGame(proof.proof, proof.inputs);
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

  const tx = await getContract(signer).verifyLetter(proof.proof, proof.inputs, gameId);
  await tx.wait();
}

function getContract(signer) {
  return new ethers.Contract(config.contractAddress, hangmanZokratesContract.abi, signer);
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