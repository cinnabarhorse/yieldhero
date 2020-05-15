import Web3Modal from "web3modal";

export function getWeb3Modal() {


    //   const Fortmatic = require("fortmatic")
    //  const Portis = require("@portis/web3")


    const WalletConnectProvider = require("@walletconnect/web3-provider").default

    const providerOptions = {

        /*  fortmatic: {
              package: Fortmatic, // required
              options: {
                  key: "pk_test_B086452452BE45F2" // required
              }
          },
          */
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: "80ddd93e5e194b11ac8279036bc49d97",
            }
        },
        /*
        portis: {
            package: Portis, // required
            options: {
                id: "a35307ef-69ea-42bc-b7ae-6ac995fa85f4" // required
            }
        }
        */

    };


    const web3Modal = new Web3Modal({
        network: process.env.NETWORK === "main" ? "mainnet" : process.env.NETWORK,// optional
        cacheProvider: true, // optional
        providerOptions: providerOptions  // required
    });

    return web3Modal

}