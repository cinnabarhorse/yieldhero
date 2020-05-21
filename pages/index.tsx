
import { withApollo } from '../lib/apollo'

import { useStateValue } from '../State/globalState'

import { Row, Col } from 'react-bootstrap'

import NextStyledFooter from '../components/NextStyledFooter'
import Router from 'next/router'
import AuthModal from '../components/AuthModal'
import { donateGradient, poolGradient, swapGradient, themeBlack, deflastGradient, furucomboGradient, linkColor } from '../theme'
import { useEffect } from 'react'
import Link from 'next/link'
import DiscordHoverButton from '../components/DiscordHoverButton'

const IndexPage = () => {

    const [{ showAuthModal }, dispatch] = useStateValue()

    useEffect(() => {
        dispatch({
            type: 'updateCurrentHeader',
            currentHeader: "Yield Hero"
        })
    }, [])

    return (

        <div>


            <header>🛠 Created by YieldHero</header>

            <Row style={{ marginTop: 30 }}>
                <Col xl={6} lg={6} md={12} sm={12} xs={12}>

                    <Link href="/swap">

                        <button onClick={() => {


                            Router.push("/swap").then(() => {
                                dispatch({
                                    type: 'updateCurrentHeader',
                                    currentHeader: "Swap aTokens"
                                })
                            })
                        }
                        } >
                            <p>
                                🤖 Swap aTokens
    </p>

                            <div>Easily swap your aTokens for the highest yield</div>
                        </button>
                    </Link>

                </Col>

                <Col xl={6} lg={6} md={12} sm={12} xs={12}>


                    <Link href="/redirect">
                        <button onClick={() => {


                            Router.push("/redirect").then(() => {

                                window.scrollTo(0, 0)

                                dispatch({
                                    type: 'updateCurrentHeader',
                                    currentHeader: "Redirect Yield"
                                })
                            })

                        }} style={{ background: donateGradient }}>



                            <p> 😇 Become a Yield Hero
   </p>


                            <div>Redirect your Aave yield to support Ethereum open-source #buidlers</div>


                        </button>
                    </Link>


                </Col>




                <div style={{ marginTop: 20 }}></div>


                <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                    <button

                        onClick={() => window.open(`https://${process.env.BALANCER_POOLS_URL}/${process.env.POOL_ADDRESS}`)}
                        style={{ background: poolGradient }}>

                        <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><img src={"/coins/aDAI.svg"} width={44} style={{ marginRight: 8 }} /> Join aToken Pool
                           </p>

                        <div>Earn fees by providing aToken Liquidity</div>
                    </button>
                </Col>

            </Row>




            <header>🤲 Partner dApps</header>

            <div>Feature your #yieldhack dApp here! <a style={{ color: linkColor }} target="_blank" href=" https://discord.gg/Hm9UFkb">Join</a> our discord to apply.</div>



            <Row style={{ marginTop: 30 }}>
                <Col xl={6} lg={6} md={12} sm={12} xs={12}>


                    <button style={{ background: furucomboGradient }} onClick={() => {
                        window.open("https://furucombo.app")
                    }
                    } >
                        <p>
                            <img width="100%" src="/images/partners/furucombo.svg" />


                        </p>

                        <div>Build your own DeFi legos into one transaction without knowing how to code.</div>
                    </button>


                </Col>

                <Col xl={6} lg={6} md={12} sm={12} xs={12}>



                    <button onClick={() => {

                        window.open("https://deflast.finance")

                    }} style={{ background: deflastGradient }}>



                        <p>    <img width="100%" height="50" src="/images/partners/deflast.svg" />
                        </p>


                        <div>Instantly swap your collateral on Compound</div>


                    </button>



                </Col>

            </Row>




            {
                showAuthModal &&
                <AuthModal />
            }

            <style jsx>
                {`

                    header {
                        margin-top:20px;
                        margin-bottom:20px;
                        font-size:24px;
                        color:${themeBlack};
                        text-align:left;
                        text-transform:uppercase;
                        letter-spacing:1px;
                        font-weight:800;
                    }

                    .descContainer {
                        display:flex;
                        flex:1;
                        align-items:center;
                        justify-content:center;
                        margin-bottom:30px;
                        background:ghostwhite;
                        height:50px;
                        margin-top:20px;
                        border-radius:20px;
                    }
                    .desc {
                        font-weight:500;
                       color:${themeBlack};
                        font-size:21px;
                    }

                    button {
                        border-radius:16px;
                        display:flex;
                        flex-direction:column;
                        justify-content:center;
                        align-items:center;
                        width:100%;
                        height:180px;
                        margin-bottom:20px;
                        background:${swapGradient};
                        transition:box-shadow 0.2s;
                        box-shadow:0px 0px 8px rgba(0, 0, 0, 0.3) 
                    }

                    button:hover {
                        box-shadow:0px 0px 16px rgba(0, 0, 0, 0.4);
                    }

                    button > p {
                        font-weight:bold;
                        font-size:32px;
                    }

                    button > div {
                        font-size:16px;
                        font-weight:300;
                        margin-left:30px;
                        margin-right:30px;
                    }

                    @media screen and (max-width:991px) {

                        .descContainer {
                            padding:15px;
                            height:80px;
                        }
                        .desc {
                            font-size:18px;
                            text-align:center;
                        }
                    }
                `}
            </style>


            <DiscordHoverButton />


            <NextStyledFooter />

        </div >
    )

}

export default withApollo({ ssr: true })(IndexPage)
