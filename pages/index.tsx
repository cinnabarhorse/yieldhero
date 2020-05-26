
import { withApollo } from '../lib/apollo'

import { useStateValue } from '../State/globalState'

import { Row, Col } from 'react-bootstrap'

import NextStyledFooter from '../components/NextStyledFooter'

import AuthModal from '../components/AuthModal'
import { donateGradient, poolGradient, swapGradient, themeBlack, deflastGradient, furucomboGradient, linkColor } from '../theme'
import { useEffect } from 'react'
import DiscordHoverButton from '../components/DiscordHoverButton'
import HomepageLink from '../components/HomepageLink'
import HomepageButton from '../components/HomepageButton'

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
                <Col xl={8} lg={8} md={12} sm={12} xs={12}>
                    <HomepageLink
                        background={donateGradient}
                        href="/redirect"
                        icon={<p>
                            <img src="/yieldherologo.svg" width="40" style={{ borderRadius: 20 }} />
                        </p>}
                        title="Become a Yield Hero"
                        subtitle="Redirect your Aave yield to support Ethereum open-source #buidlers"
                        newHeader="Redirect Yield"

                    />


                </Col>


                <Col xl={4} lg={4} md={12} sm={12} xs={12}>
                    <HomepageLink
                        background={donateGradient}
                        href="/leaderboard"
                        icon={<p style={{ fontSize: 32 }}>👑</p>}
                        title="YH Leaderboard"
                        subtitle="See who's contributing the most to open-source Web3 development"
                        newHeader="Leaderboard"

                    />
                </Col>
            </Row>

            <Row style={{ marginTop: 10 }}>

                <Col xl={6} lg={6} md={12} sm={12} xs={12}>

                    <HomepageLink
                        background={swapGradient}
                        href="/swap"
                        icon={<p style={{ fontSize: 32 }}>🤖</p>}
                        title="Swap aTokens"
                        subtitle="Easily swap your aTokens for the highest yield"
                        newHeader="Swap aTokens"

                    />

                </Col>


                <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                    <HomepageButton
                        url={`https://${process.env.BALANCER_POOLS_URL}/${process.env.POOL_ADDRESS}`}
                        title={<p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', fontSize: 32, fontWeight: 'bold' }}><img src={"/coins/aDAI.svg"} width={44} style={{ marginRight: 8 }} />
                            Join aToken Pool </p>}
                        subtitle="Earn fees by providing aToken Liquidity"
                        background={poolGradient}
                    />
                </Col>

            </Row>




            <header>🤲 Partner dApps</header>

            <div>Feature your #yieldhack dApp here! <a style={{ color: linkColor }} target="_blank" href=" https://discord.gg/Hm9UFkb">Join</a> our discord to apply.</div>



            <Row style={{ marginTop: 30 }}>
                <Col xl={6} lg={6} md={12} sm={12} xs={12}>


                    <HomepageButton
                        url="https://furucombo.app"
                        background={furucomboGradient}
                        title={<img width="80%" src="/images/partners/furucombo.svg" />}
                        subtitle="Build your own DeFi legos into one transaction without knowing how to code."
                    />



                </Col>

                <Col xl={6} lg={6} md={12} sm={12} xs={12}>


                    <HomepageButton
                        url="https://deflast.finance"
                        background={deflastGradient}
                        title={<img width="100%" height="50" src="/images/partners/deflast.svg" />}
                        subtitle="Instantly swap your collateral on Compound"
                    />


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
