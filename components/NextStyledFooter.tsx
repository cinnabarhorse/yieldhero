import React from "react";
import Col from "react-bootstrap/Col";
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Link from "next/link";
import { DiscordSVG, TwitterSVG } from "../icons";


interface FooterProps {

}

const Footer = (props: FooterProps) => {
    return (
        <div style={{ marginTop: 170, marginBottom: 20 }}>


            <Container>

                <style jsx>
                    {`

                    h3 {
                        font-weight:900;
                        letter-spacing:1.2px;
                        text-transform:uppercase;
                        font-size:18px;
                        line-height:22px;
                    }
                    h4 {
                        font-weight:900;
                        letter-spacing:1.2px;
                        text-transform:uppercase;
                        font-size:14px;
                        line-height:22px;

                    }

                    p {
                        font-weight:300;
                    }

                    a {
                        
                        transition:color:0.2s;
                    }

                    a:hover {
                      
                    }

                    .social-icon {
                        width:25px;
                        height:25px;
                        margin-right:8px;
                    }

                    svg {
                        width:25px;
                        height:25px;
                    }
                `}
                </style>


                <Row>

                    <Col style={{ marginBottom: 20 }} xl={6} lg={6} md={12} sm={12} xs={12}>
                        <h3>Yield Hero</h3>

                        <p>Created by <a href="https://twitter.com/@coderdannn">@coderdannn
                            </a> during ETHGlobal 2020.</p>

                    </Col>



                    <Col style={{ marginBottom: 20 }} xl={2} lg={2} md={12} sm={12} xs={12}>
                        <h4>PROJECT</h4>

                        <div><Link href="/about"><a>About</a></Link></div>
                        <div>
                            <a href="https://github.com/cinnabarhorse/yieldhero">Source Code</a>
                        </div>
                        <div>
                            <a href={`https://${process.env.BALANCER_POOLS_URL}/${process.env.POOL_ADDRESS}`}>Pool</a>
                        </div>

                        <div>
                            <a href={process.env.NETWORK === "kovan" ? "https://testnet.aave.com/faucet" : "https://app.aave.com"}>Get aTokens</a>
                        </div>


                    </Col>

                    <Col style={{ marginBottom: 20 }} xl={2} lg={2} md={12} sm={12} xs={12}>




                    </Col>



                    <Col style={{ marginBottom: 20 }} xl={2} lg={2} md={12} sm={12} xs={12}>


                        <h4>Follow Us</h4>

                        <a className="social-icon" target="_blank" href="https://www.twitter.com/yieldhero">{TwitterSVG(25, "black")}</a>

                        <a className="social-icon" href="https://discord.gg/Hm9UFkb">{DiscordSVG(25, "black")}</a>






                    </Col>

                </Row>
            </Container>
        </div>

    );
}
export default Footer;