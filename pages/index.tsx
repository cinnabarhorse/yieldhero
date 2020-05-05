import App from '../components/App'
import Header from '../components/Header'
import { withApollo } from '../lib/apollo'
import Reserves from '../components/Reserves'
import UserReserve from '../components/UserReserve'
import { useStateValue } from '../State/globalState'
import AuthModal from '../components/AuthModal'
import SwapButton from '../components/SwapButton'
import { Row, Col } from 'react-bootstrap'
import { buttonInactive, themeBlack } from '../theme'

const IndexPage = () => {

  const [{ showAuthModal, currentAccount, currentNetwork, selectedIn }, dispatch] = useStateValue()

  return (

    <App>



      <Header />

      {currentAccount && currentNetwork === "kovan" &&
        <Row>
          <UserReserve />

          <Col xl={1} lg={1}>
            <div className="arrowRight">➜</div>
            <div className="arrowDown">↓</div>
          </Col>
          <Reserves />
        </Row>
      }


      {!currentAccount &&
        <div>Connect your wallet to begin swapping!</div>
      }



      {showAuthModal &&
        <AuthModal />
      }


      {currentAccount && currentNetwork === "kovan" &&
        <SwapButton />
      }


      {currentAccount && currentNetwork !== "kovan" &&
        <div>This dapp currently only works on Kovan! You are connected to {currentNetwork}.</div>
      }


      <style jsx>
        {`
          .arrowRight {
            display:flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            height: 100%;
            font-size: 48px;
            color:${selectedIn ? themeBlack : buttonInactive};
            transition:color 0.2s;
          }

          .arrowDown {
            display:none;
          }

          @media screen and (max-width:991px) {

            .arrowRight {
              display:none;
            }
            .arrowDown {
              display:flex;
            justify-content: center;
            align-items: center;
            flex: 1;
            height: 100%;
            font-size: 48px;
            transition: color 0.2s;
            color:${selectedIn ? themeBlack : buttonInactive};
            }
          }
        `}
      </style>

    </App>
  )

}

export default withApollo({ ssr: true })(IndexPage)
