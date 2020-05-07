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
import NextStyledFooter from '../components/NextStyledFooter'
import NextReusableHead from '../components/NextReusableHead'

const IndexPage = () => {

  const [{ showAuthModal, currentAccount, currentNetwork, selectedIn }, dispatch] = useStateValue()

  return (

    <App>


      <NextReusableHead
        title="Gobbl - Hack your yield"
        description="Easily swap your aTokens for the best yield"
        siteName="Gobbl"
        url="https://gobbl.now.sh"
        image="https://gobbl.now.sh/yieldhack.jpg"
        faviconPath="https://gobbl.now.sh/favicon.ico"

      />


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

      <NextStyledFooter />

    </App>
  )

}

export default withApollo({ ssr: true })(IndexPage)
