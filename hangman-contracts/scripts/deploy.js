const hangman = require("../artifacts/contracts/HangmanZokrates.sol/HangmanZokrates.json");
const verifier = require("../artifacts/contracts/verifiers/HangmanVerifierZokrates.sol/HangmanVerifierZokrates.json");

async function main() {
    const deployer = await ethers.getContractFactory("DeterministicDeployFactory");
    const factory = await deployer.attach("0xD810Cc696B0c405769021e1a389aCFfCFCddd94a");
 
    const verifierDeployTx = await factory.deploy(verifier.bytecode, ethers.utils.id("hangman-zokrates-verifier-v1-2"));
    const verifierTxReceipt = await verifierDeployTx.wait();
    console.log("Verifier deployed to address:", verifierTxReceipt.events[0].args[0]);

    const hangmanInitCode = hangman.bytecode + encoder(["address"], [verifierTxReceipt.events[0].args[0]])
    // Start deployment, returning a promise that resolves to a contract object
    const hangmanDeployTx = await factory.deploy(hangmanInitCode, ethers.utils.id("hangman-zokrates-v1"));

    const txReceipt = await hangmanDeployTx.wait();
    console.log("Contract deployed to address:", txReceipt.events[0].args[0]);
}

function encoder(types, values) {
    const abiCoder = ethers.utils.defaultAbiCoder;
    const encodedParams = abiCoder.encode(types, values);
    return encodedParams.slice(2);
};
 
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });