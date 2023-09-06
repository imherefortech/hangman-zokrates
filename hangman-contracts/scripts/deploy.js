const { bytecode } = require("../artifacts/contracts/Hangman.sol/Hangman.json");

async function main() {
    const deployer = await ethers.getContractFactory("DeterministicDeployFactory");
    const factory = await deployer.attach("0xD810Cc696B0c405769021e1a389aCFfCFCddd94a");
 
    // Start deployment, returning a promise that resolves to a contract object
    const deployTx = await factory.deploy(bytecode, ethers.utils.id("hangman"));

    const txReceipt = await deployTx.wait();
    console.log("Contract deployed to address:", txReceipt.events[0].args[0]);
}
 
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });