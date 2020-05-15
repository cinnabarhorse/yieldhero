import Web3Modal from "web3modal";

export function getWeb3Modal() {


    const WalletConnectProvider = require("@walletconnect/web3-provider").default

    console.log('end:', process.env.INFURA_ID)

    const providerOptions = {

        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: process.env.INFURA_ID,
            }
        },
    };

    const web3Modal = new Web3Modal({
        network: process.env.NETWORK === "main" ? "mainnet" : process.env.NETWORK,// optional
        cacheProvider: true, // optional
        providerOptions: providerOptions  // required
    });

    return web3Modal

}