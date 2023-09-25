export default
{
    contractAddress: "0x0e082ae2d6CE79678b0F84e6c50b95E51372094f",
    chains: [{
        chainId: "0x5",
        rpcUrls: ["https://ethereum-goerli.publicnode.com"],
        chainName: "Ethereum Goerli",
        nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: ["https://goerli.etherscan.io"]
    }, {
        chainId: "0x8274f",
        rpcUrls: ["https://sepolia-rpc.scroll.io/"],
        chainName: "Scroll Sepolia",
        nativeCurrency: {
            name: "SepoliaETH",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: ["https://sepolia-blockscout.scroll.io/"]
    }, {
        chainId: "0x89",
        rpcUrls: ["https://polygon-rpc.com"],
        chainName: "Polygon",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
        },
        blockExplorerUrls: ["https://polygonscan.com"]
    }],
    ethRpc: "https://eth.llamarpc.com"
}