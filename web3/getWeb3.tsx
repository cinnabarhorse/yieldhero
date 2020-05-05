//const Web3 = require('web3');
import Web3 from 'web3'
declare var window: any;


export default function getWeb3() {
    let getWeb3: any = new Promise(async function (resolve, reject) {

        // Wait for loading completion to avoid race conditions with web3 injection timing.
        var results;
        let _web3;
        try {
            if (typeof window !== 'undefined' && window.ethereum) {

                console.log("Eth enable");
                _web3 = new Web3(window.ethereum);

                console.log('_web3:', _web3)
                await window.ethereum.enable();
                results = {
                    web3: _web3
                };
                let net;
                await _web3.eth.net.getId().then(res => {
                    console.log("inside net id");
                    console.log(res);
                    net = res;
                });
                // console.log(net);
            }
            // Checking if Web3 has been injected by the browser (Mist/MetaMask)
            else if (typeof window !== 'undefined' && window.web3) {
                // Use Mist/MetaMask's provider.
                _web3 = new Web3(window.web3.currentProvider);

                console.log("Injected web3 detected.");
                let net;
                await _web3.eth.net.getId().then(res => {
                    net = res;
                });
                // console.log(net);

                results = {
                    web3: _web3
                };
            } else {
                // Fallback to localhost if no web3 injection. We've configured this to
                // use the development console's port by default.
                // var provider = new Web3.providers.HttpProvider(
                //    "https://mainnet.infura.io/v3/c73ecd76112b419ab2766b7c7f3e233e"
                // );
                _web3 = new Web3(
                    new Web3.providers.HttpProvider(
                        //process.env.INFURA_URL
                        // "https://kovan.infura.io/v3/cfac36101869499f961b31585449de88"
                        "https://mainnet.infura.io/v3/c73ecd76112b419ab2766b7c7f3e233e"
                    )
                );
                // _web3 = new Web3(provider);
                // console.log(_web3);
                results = {
                    web3: _web3
                };

                resolve(results);
                console.log("No web3 instance injected, using Infuria web3.");
            }

            resolve(results);
        } catch (e) {
            console.log('error:', e)
            // throw new Error(e.message || e);
        }
    });

    return getWeb3
}


