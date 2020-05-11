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
import RedirectButton from '../components/interest/RedirectButton'

const IndexPage = () => {

  const [{ showAuthModal, currentAccount, selectedIn }, dispatch] = useStateValue()


  useEffect(() => {
    dispatch({
      type: 'updateCurrentHeader',
      currentHeader: "Redirect Yield"
    })
  }, [])

  return (

    <div>


      <App>


        {currentAccount && /*&& currentNetwork === "kovan" &&*/
          <div>


            <div style={{ fontWeight: 300, fontSize: '18px' }}>Redirect your Aave yield to support OSS development</div>

            <Row style={{ marginTop: 20 }}>

              <TokenList />



            </Row>

            <Row style={{ marginTop: 50 }}>
              <RecipientList />
            </Row>

          </div>

        }


        {!currentAccount &&
          <div style={{ fontWeight: 300, fontSize: '18px' }} > Connect your wallet to begin swapping!</div>
        }






        {showAuthModal &&
          <AuthModal />
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



    </div >

  )

}

export default withApollo({ ssr: true })(IndexPage)
