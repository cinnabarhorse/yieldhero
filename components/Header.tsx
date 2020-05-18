
import React, { useEffect } from 'react'
import { useStateValue } from '../State/globalState'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import Dropdown from 'react-bootstrap/Dropdown'
import { themeBlack, themeLightGray } from '../theme'
import Router from 'next/router'
import { superHero } from '../icons'
import loadFirebase from '../firebase'
import Web3 from 'web3'

import { smartTrim } from '../functions'
import { getWeb3Modal } from '../web3/web3'
import Link from 'next/link'





interface HeaderProps {
  title: string
  desc: string
}

const Header = (props: HeaderProps) => {

  const { title, desc } = props

  const [{ currentAccount, authUser, currentNetwork, currentHeader }, dispatch] = useStateValue()


  useEffect(() => {
    checkUser()
  }, [authUser])

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

  async function checkUser() {

    if (authUser) return;

    const firebase = await loadFirebase()

    firebase.auth().onAuthStateChanged(async (user) => {

      if (user) {

        const web3Modal = getWeb3Modal()

        web3Modal.on("close", function () {
          dispatch({
            type: "updateShowAuthModal",
            showAuthModal: false
          })
        })


        web3Modal.connect()
          .then(async (provider) => {

            const web3 = new Web3(provider);

            const accounts = await web3.eth.getAccounts()
            const network = await web3.eth.net.getNetworkType()
            if (accounts.length > 0) {
              updateState(web3, accounts[0], network)
            }

          })
          .catch((err) => {
            //   web3Modal.toggleModal()
            console.log('err:', err)
          })



        dispatch({
          type: "updateAuthUser",
          authUser: user
        })
      }
      else {
        dispatch({
          type: "updateAuthUser",
          authUser: "none"
        })
      }

    })

  }


  useEffect(() => {

    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        logout()
      })

      //@ts-ignore
      window.ethereum.on('networkChanged', function (netId) {
        // Time to reload your interface with netId
        logout()
      })
    }
    //@ts-ignore

  }, [])


  async function logout() {

    const firebase = await loadFirebase()

    try {

      await firebase.auth().signOut()


      const web3Modal = getWeb3Modal()

      web3Modal.clearCachedProvider()


      console.log('cached:', web3Modal.cachedProvider)

      dispatch({
        type: "updateCurrentAccount",
        currentAccount: undefined
      })

      dispatch({
        type: "updateUserInfo",
        userInfo: undefined
      })

    } catch (error) {
      alert(error)
    }
  }

  return (

    <div className="headerContainer">

      <style jsx>{`
    
      .headerContainer {
          background:white;
          display: flex;
          height:80px;
          width:100%;
          flex-direction: row;
          align-content: center;
          justify-content: center;
          justify-items: center;
          z-index: 999;
          margin: 0 auto;
          opacity: 1;
      
        align-items:flex-start;
      }

      .navInnerContainer {
        display:flex;
        align-items:center;
        flex-direction:row;
        width:100%;
       height:80px;
      
      }

      .textContainer {
        justify-content:center;
        display:flex;
        flex-direction:column;
      }

      .headerTitle {
        margin-top:-4px;
        font-size:32px;
        font-weight:800;
    
        color:${themeBlack};
       
      }

      .desc {
        margin-top:-8px;
        color:${themeLightGray};
        font-size:14px;
        text-align:left;
      }


      .connectButtonContainer {
     
        margin-left:15px;
        display:flex;
        flex:1;
        align-items:center;
        justify-content:flex-end;
      }

      .connectButton {
      display:flex;
      justify-content:center;
      align-items:center;
        min-width:180px;
        height:50px;
        background:none;
        border: solid 2px ${themeBlack};
        color:${themeBlack};
        border-radius:20px;
        transition:background 0.2s, color 0.2s;
      }

      .connectButton:hover {
        background:${themeBlack};
        color:white;
      }

      .jazzicon {
        margin:10px;
        padding:15px;
        background:none;
        border:none;
      }

      a {
        font-size: 14px;
        margin-right: 15px;
        text-decoration: none;
      }
      .is-active {
        text-decoration: underline;
      }


      @media screen and (max-width:768px) {

        .headerContainer {
          flex-direction:row;
          align-items:flex-start;
        }
      

        .headerTitle {
          font-size:24px;
        }

        .connectButton {
          font-size:14px;
          height:50px;
          margin:0;
          padding:0;
          width:120px;
        
          min-width:unset;
        }

        .connectButton {
          margin-left:0 !important;
        }

        .desc {
          margin-top:0px;
         margin-left:0px;
        }
      }

      @media screen and (max-width:576px) {
       
      
      }

    `}</style>

      <div className="navInnerContainer">

        <Link href="/">
          <a className="headerLogo">
            <img src="/yieldherologo.svg" width="100%" height="100%" />
          </a>
        </Link>



        {typeof window !== 'undefined' && window.location.pathname !== "/" &&
          <button className="backButton" onClick={() => {

            Router.replace("/").then(() => {
              dispatch({
                type: 'updateCurrentHeader',
                currentHeader: `${superHero(24)} Yield Hero`
              })

            })
          }}>
            <div>⬅︎</div>
          </button>
        }


        <div className="textContainer">
          <span className="headerTitle">{currentHeader}</span>

          {typeof window !== 'undefined' && window.location.pathname === "/" &&
            <span className="desc"> {desc}</span>
          }


        </div>



        <div className="connectButtonContainer">

          {!currentAccount && !authUser &&
            <div>Loading</div>
          }

          {!currentAccount && authUser === "none" &&
            <button className="connectButton" style={{ marginLeft: 10 }} onClick={() => {


              dispatch({
                type: "updateShowAuthModal",
                showAuthModal: true
              })
            }}>Connect Wallet</button>
          }

          {currentAccount && authUser && authUser !== "none" &&

            <Dropdown>
              <Dropdown.Toggle style={{ background: 'none', border: 'none' }} variant="primary" id="dropdown-basic">
                <Jazzicon diameter={40} seed={jsNumberForAddress(currentAccount)} />
              </Dropdown.Toggle>

              <Dropdown.Menu>

                <Dropdown.Item onClick={() => {

                  navigator.clipboard.writeText(currentAccount)
                    .then(() => alert("Wallet address copied!"))
                }}>
                  {currentAccount ? smartTrim(currentAccount, 12) : ""}
                </Dropdown.Item>


                <Dropdown.Item>
                  Network: {currentNetwork ? currentNetwork : "Loading..."}
                </Dropdown.Item>

                <Dropdown.Item onClick={() => {
                  logout()
                }}>Logout</Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>


          }
        </div>


      </div>

      <style jsx>
        {`

          .headerLogo {
            width:50px;
            height:50px;
            border-radius: 25px;
            margin-right: 12px;
            padding:0;
            overflow:hidden;
          }
        
          .backButton {
           font-size 50px;
          margin-right: 10px;
          justify-items:center;
          padding:0;
          padding-left:10px;
          padding-right:10px;
          background:none;
          transition:transform 0.2s;
          }
          .backButton:hover {
            transform:scale(1.1);
          }

          .backButton > div {
            
            padding:0;
            color:${themeBlack};
       
           
          }
        `}
      </style>

    </div>


  )
}

export default Header
