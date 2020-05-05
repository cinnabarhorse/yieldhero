
import React, { useEffect } from 'react'
import { useStateValue } from '../State/globalState'

import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import Dropdown from 'react-bootstrap/Dropdown'
import { themeBlack } from '../theme'


const Header = () => {

  const [{ currentAccount, currentNetwork }, dispatch] = useStateValue()


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

    try {

      dispatch({
        type: "updateCurrentAccount",
        currentAccount: undefined
      })

      dispatch({
        type: "updateUserInfo",
        userInfo: undefined
      })

      dispatch({
        type: "updateTokenVotes",
        tokenVotes: undefined
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
        font-size:32px;
        font-weight:800;
        text-decoration:underline;
        color:${themeBlack};
       
      }

      .desc {
        margin-left:15px;
        font-size:14px;
        text-align:center;
      }


      .connectButtonContainer {
        margin-left:15px;
        display:flex;
        flex:1;
        align-items:center;
        justify-content:flex-end;
      }

      .connectButton {
        margin:10px;
        padding:15px;
        min-width:180px;
        height:50px;
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
      

        .connectButton {
          font-size:14px;
          height:70px;
          margin:0;
          padding:0;
          width:100px;
          min-width:unset;
        }

        .connectButton {
          margin-left:0 !important;
        }

        .desc {
          display:none;
        }
      }

      @media screen and (max-width:576px) {
       
      
      }

    `}</style>

      <div className="navInnerContainer">

        <div className="textContainer">
          <span className="headerTitle">Gobbl v0.01</span>

        </div>

        <div className="desc">Easily swap your aTokens for the best yield</div>

        <div className="connectButtonContainer">
          {!currentAccount &&
            <button className="connectButton" style={{ marginLeft: 10 }} onClick={() => {
              dispatch({
                type: "updateShowAuthModal",
                showAuthModal: true
              })
            }}>Connect Wallet</button>
          }

          {currentAccount &&

            <Dropdown>
              <Dropdown.Toggle style={{ background: 'none', border: 'none' }} variant="primary" id="dropdown-basic">
                <Jazzicon diameter={40} seed={jsNumberForAddress(currentAccount)} />
              </Dropdown.Toggle>

              <Dropdown.Menu>


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

    </div>


  )
}

export default Header
