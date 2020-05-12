import App from '../components/Layout'
import { withApollo } from '../lib/apollo'
import OutputToken from '../components/atokens/OutputToken'
import InputToken from '../components/atokens/InputToken'
import { useStateValue } from '../State/globalState'
import SwapButton from '../components/atokens/SwapButton'
import { Row, Col } from 'react-bootstrap'
import { buttonInactive, themeBlack } from '../theme'
import NextStyledFooter from '../components/NextStyledFooter'
import { useEffect } from 'react'
import { usingCorrectNetwork } from '../functions'

const IndexPage = () => {

  const [{ showAuthModal, currentAccount, currentNetwork, selectedIn }, dispatch] = useStateValue()

  useEffect(() => {
    dispatch({
      type: 'updateCurrentHeader',
      currentHeader: "Swap aTokens"
    })
  }, [])


  return (

    <App>

      {currentAccount && currentNetwork && usingCorrectNetwork(currentNetwork) &&


        <div>
          <div style={{ fontWeight: 300, fontSize: '18px' }}>Easily swap your aTokens for the highest yield</div>

          <Row style={{ marginTop: 20 }}>
            <InputToken />

            <Col xl={1} lg={1}>
              <div className="arrowRight">➜</div>
              <div className="arrowDown">↓</div>
            </Col>
            <OutputToken />
          </Row>


          <SwapButton />

        </div>




      }


      {
        !currentAccount &&
        <div style={{ marginTop: 20, marginBottom: 500, fontWeight: 300, fontSize: '18px' }}>Connect your wallet to begin swapping!</div>
      }

      {currentAccount && currentNetwork && !usingCorrectNetwork(currentNetwork) &&
        <div>This dapp currently only works on {process.env.NETWORK} network! You are connected to {currentNetwork}.</div>
      }


      < style jsx>
        {`

        .titleContainer {
          background:whitesmoke;
        }

          .title {
            font-size:48px;
          }

          .desc {

          }

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

    </App >
  )

}

export default withApollo({ ssr: true })(IndexPage)
