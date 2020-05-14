import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal'
import { useStateValue } from '../State/globalState'
import getWeb3 from '../web3/getWeb3';
import Fortmatic from 'fortmatic'
import Web3 from 'web3'
import { themeBlack } from "../theme";
import loadFirebase from "../firebase";



const AuthModal = () => {

    const [{ showAuthModal, authUser }, dispatch] = useStateValue()
    const [loadingFortmatic, setLoadingFortmatic] = useState(false)

    function updateState(web3, address, network) {

        var ENS = require('ethereum-ens');
        var ens = new ENS(web3);

        dispatch({
            type: "updateEnsProvider",
            ensProvider: ens
        })

        dispatch({
            type: "updateCurrentAccount",
            currentAccount: address
        })


        dispatch({
            type: 'updateCurrentNetwork',
            currentNetwork: network
        })

        dispatch({
            type: "updateWeb3",
            globalWeb3: web3
        })

        dispatch({
            type: 'updateShowAuthModal',
            showAuthModal: false
        })

    }
    /*
    Connects Fortmatic wallet
    */
    async function handleConnectFortmatic() {

        setLoadingFortmatic(true)

        try {
            let fm = new Fortmatic(process.env.FORTMATIC_KEY_PROD);
            //@ts-ignore
            let web3 = new Web3(fm.getProvider());

            console.log('webb3:', web3)

            const accounts = await web3.eth.getAccounts()
            const network = await web3.eth.net.getNetworkType()


            if (accounts && accounts.length > 0) {
                updateState(web3, accounts[0], network)

                setLoadingFortmatic(false)
            }
            else {
                setLoadingFortmatic(false)
            }
        } catch (error) {
            alert(error)
            setLoadingFortmatic(false)
        }


    }


    /*
Connect with Metamask
    */
    async function handleConnectMetamask() {
        const web3 = await getWeb3()
        const accounts = await web3.web3.eth.getAccounts()
        const network = await web3.web3.eth.net.getNetworkType()
        if (accounts.length > 0) {
            await signInWithFirebase(accounts[0])
            updateState(web3.web3, accounts[0], network)
        }
    }

    async function signInWithFirebase(account: string) {
        const firebase = await loadFirebase()

        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

        firebase.auth().signInAnonymously()
            .then(async (result) => {

                dispatch({
                    type: "updateAuthUser",
                    authUser: result.user
                })

                //Add anonymous user with wallet address as doc ID
                firebase.firestore().collection("users").doc(`${account}_${process.env.NETWORK}`).onSnapshot((snapshot) => {
                    if (snapshot.exists) {
                        /*  dispatch({
                              type: "updateUserInfo",
                              userInfo: {
                                  id: account,
                                  votes: snapshot.data()!.votes
                              }
                          })
                          */
                    }

                    //Doesn't exist, add new user
                    else {
                        firebase.firestore().collection("users").doc(`${account}_${process.env.NETWORK}`).set({
                            createdOn: firebase.firestore.Timestamp.now(),
                            network: process.env.NETWORK
                        })
                            .then(() => {
                                /*  dispatch({
                                      type: "updateUserInfo",
                                      userInfo: {
                                          id: account,
                                          votes: []
                                      }
                                  })
                                  */
                            })



                        console.log('result:', result)
                    }

                })

                //Already exists, just load data


            })
            .catch(function (error) {

                console.log('error:', error.message)
            });
    }



    if (!showAuthModal) return null;

    return (
        <Modal
            show={showAuthModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <style jsx>
                {`
                    .bodyContainer {
                        display:flex;
                        width:100%;
                        justify-content:center;
                    }

                    .profilePic {
                        width:150px;
                        height:150px;
                        border-radius:10px;
                    }

                    .buttonContainer {
                        display:flex;
                        justify-content:center;
                        flex-direction:row;
                        margin:15px;
                    }

                    button {
                        display:flex;
                        justify-content:center;
                        width:150px;
                        height:60px;
                       margin:20px;
                       font-weight:800;
                    }

                    button {
                        background:none;
                        border:solid 4px ${themeBlack};
                        color:${themeBlack};
                        transition: background 0.2s, color 0.2s;
                    }
                    button:hover {
                        background:${themeBlack};
                        color:white;
                    }

                    .boost {
                    background:#FC2E53;
                        border:none;
                        color:white;
                        transition: background 0.2s, color 0.2s, box-shadow 0.2s;

                    }

                    .boost:hover {
                    box - shadow:0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.3);
                    }

                    .boost:disabled {
                    background:gray;
                    }
                `}
            </style>



            <Modal.Header closeButton onClick={() => dispatch({
                type: "updateShowAuthModal",
                showAuthModal: false
            })}>
                <Modal.Title style={{ display: 'flex', flex: 1, justifyContent: 'center', fontWeight: 800, textAlign: 'center' }} id="contained-modal-title-vcenter">
                    Connect Wallet to Yield Hero
                </Modal.Title>

            </Modal.Header>

            <Modal.Body>


                <div className="buttonContainer">
                    <button
                        onClick={() => handleConnectMetamask()}
                        className="notNow">
                        Metamask
                        </button>

                    {/*}     <button
                        disabled={loadingFortmatic}
                        onClick={() => handleConnectFortmatic()}
                        className="boost">
                        {loadingFortmatic ? "Loading..." : "Fortmatic"}
                    </button>
        {*/}
                </div>

            </Modal.Body>

        </Modal>
    );
}
export default AuthModal;