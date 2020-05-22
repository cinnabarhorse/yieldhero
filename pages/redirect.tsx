import App from '../components/Layout'
import { withApollo } from '../lib/apollo'
import { useStateValue } from '../State/globalState'
import AuthModal from '../components/AuthModal'
import { Row, Col, Container } from 'react-bootstrap'
import { buttonInactive, themeBlack } from '../theme'
import NextStyledFooter from '../components/NextStyledFooter'
import TokenList from '../components/interest/TokenList'
import { useEffect } from 'react'
import RecipientList from '../components/interest/RecipientList'
import { usingCorrectNetwork } from '../functions'
import NextReusableHead from '../components/NextReusableHead'
import TweetModal from '../components/TweetModal'

const IndexPage = () => {

  const [{ showAuthModal, currentNetwork, currentAccount, selectedIn }, dispatch] = useStateValue()


  useEffect(() => {
    dispatch({
      type: 'updateCurrentHeader',
      currentHeader: "Redirect Yield"
    })
  }, [])

  return (

    <div>


      <App>

        <NextReusableHead
          title="Yield Hero - Redirect your Aave yield to support Ethereum open-source #buidlers"
          description="Redirect your Aave yield to support Ethereum open-source #buidlers"
          siteName="YieldHero"
          url={`${process.env.BASE_URL}/redirect`}
          image={`${process.env.BASE_URL}/yieldherologo.png`}
          faviconPath="/favicon.ico"

        />


        {currentAccount && currentNetwork && usingCorrectNetwork(currentNetwork) &&

          <div>


            <div style={{ fontWeight: 300, fontSize: '18px' }}>Redirect your Aave yield to support Ethereum open-source #buidlers</div>

            <Row style={{ marginTop: 20 }}>

              <TokenList />



            </Row>


            <Row style={{ marginTop: 50 }}>
              <RecipientList />
            </Row>

          </div>

        }


        {!currentAccount &&
          <div style={{ fontWeight: 300, fontSize: '18px' }} > Connect your wallet to redirect yield!</div>
        }

        {showAuthModal &&
          <AuthModal />
        }

        {currentAccount && currentNetwork && !usingCorrectNetwork(currentNetwork) &&
          <div>This dapp currently only works on {process.env.NETWORK} network! You are connected to {currentNetwork}.</div>
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

        <TweetModal />

        <NextStyledFooter />

      </App>



    </div >

  )

}

export default withApollo({ ssr: true })(IndexPage)
