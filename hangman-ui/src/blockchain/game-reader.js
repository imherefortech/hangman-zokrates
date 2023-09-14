import { ethers } from 'ethers';
import hangmanContract from '../abi/hangman';
import config from '../config';

async function read(id) {
    const provider = getProvider();
    const signer = await getSigner(provider);

    if (!signer) return null;

    const contract = new ethers.Contract(config.contractAddress, hangmanContract.abi, provider);
    const contractExists = await provider.getCode(config.contractAddress);
    if (contractExists === '0x') return null;

    const game = await contract.games(id);
    const attempts = await contract.gameAttempts(id);
    const word = await contract.gameWord(id);
    const secretWordHash = await contract.secretWordHash(id);
    
    return { 
        id,
        length: Number(game.getValue("length")),
        isGuesserTurn: game.getValue("guesserTurn"),
        attempts: attempts.map(a => Number(a)),
        word: word.map(l => Number(l)),
        secretWordHash: secretWordHash.map(l => Number(l)),
        isHost: signer.address == game.getValue("host")
    };
}

function getProvider() {
    return new ethers.BrowserProvider(window.ethereum);
}

async function getSigner(provider) {
    if (await provider.hasSigner()) {
        return await provider.getSigner();
    } else {
        return null;
    }
}

export default { read };