const hangmanZokrates = require("../artifacts/contracts/HangmanZokrates.sol/HangmanZokrates.json");
const hangmanNoir = require("../artifacts/contracts/HangmanNoir.sol/HangmanNoir.json");
const verifierZokrates = require("../artifacts/contracts/verifiers/HangmanVerifierZokrates.sol/HangmanVerifierZokrates.json");
const verifierNoir = require("../artifacts/contracts/verifiers/HangmanVerifierNoir.sol/HangmanVerifierNoir.json");

async function deploy(framework) {
    if (framework !== "zokrates" && framework !== "noir") throw new Error("Framework not supported");
    const verifierBytecode = framework === "zokrates" ? verifierZokrates.bytecode : verifierNoir.bytecode;
    const contractBytecode = framework === "zokrates" ? hangmanZokrates.bytecode : hangmanNoir.bytecode;

    const deployer = await ethers.getContractFactory("DeterministicDeployFactory");
    const factory = await deployer.attach("0xD810Cc696B0c405769021e1a389aCFfCFCddd94a");

    const verifierDeployTx = await factory.deploy(verifierBytecode, ethers.utils.id(`hangman-${framework}-verifier-v1-2`));
    const verifierTxReceipt = await verifierDeployTx.wait();
    console.log("Verifier deployed to address:", verifierTxReceipt.events[0].args[0]);

    const hangmanInitCode = contractBytecode + encoder(["address"], [verifierTxReceipt.events[0].args[0]])
    // Start deployment, returning a promise that resolves to a contract object
    const hangmanDeployTx = await factory.deploy(hangmanInitCode, ethers.utils.id(`hangman-${framework}-v2`));

    const txReceipt = await hangmanDeployTx.wait();
    console.log("Contract deployed to address:", txReceipt.events[0].args[0]);
}

function encoder(types, values) {
    const abiCoder = ethers.utils.defaultAbiCoder;
    const encodedParams = abiCoder.encode(types, values);
    return encodedParams.slice(2);
};

module.exports = {
    deploy
};