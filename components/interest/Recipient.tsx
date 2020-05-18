import React, { useEffect, useState } from "react";
import { CreatorType } from "../../types";
import { useStateValue } from "../../State/globalState";
import { Row, Col } from "react-bootstrap";
import { UserReserveType } from '../../types'
import { themeBlack } from "../../theme";
import LazyLoad from 'react-lazyload'
import { makePlural } from "../../functions";
import { smartTrim } from '../../functions'
import ENSAddress from "../ENSAddress";

interface RecipientProps {
    creator: CreatorType
    supporters: any
}

const Recipient = (props: RecipientProps) => {


    const { creator, supporters } = props
    const [{ selectedCreator, currentAccount }, dispatch]:
        [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedCreator: CreatorType }, (type) => void] = useStateValue()

    const [supportAmount, setSupportAmount] = useState(undefined)

    useEffect(() => {

        if (supporters && supporters[creator.wallet]) {

            var totalAmount = 0

            supporters[creator.wallet].forEach((obj: UserReserveType) => {
                const amount = Number(obj.principalATokenBalance) / Math.pow(10, obj.reserve.decimals)
                const amountInEth = amount * Number(obj.reserve.price.priceInEth)

                totalAmount = totalAmount + amountInEth


            });

            setSupportAmount((Number(totalAmount) / Math.pow(10, 18)).toFixed(2))

        }

    }, [supporters])


    function _supporters() {
        return supporters[creator.wallet]
    }

    return (
        <div>

            <button
                className={(selectedCreator && selectedCreator.name === creator.name) ? "divBGSelected" : "divBG"}
                // style={{ width: '100%', background: 'none', color: 'black' }}
                onClick={() => {

                    if (selectedCreator && selectedCreator.name === creator.name) {
                        dispatch({
                            type: "updateSelectedCreator",
                            selectedCreator: undefined
                        })
                    }

                    else {
                        dispatch({
                            type: "updateSelectedCreator",
                            selectedCreator: creator
                        })
                    }


                }}
            // className={(selectedCreator && selectedCreator.name === creator.name) ? "divBGSelected" : "divBG"}
            >

                <Row style={{ marginLeft: 0, marginRight: 0, width: '100%' }}>

                    <Col xl={2} lg={2} md={3} sm={3} xs={3}>
                        <LazyLoad height={200}>
                            <img src={`/images/${creator.img}`} className="profile" />
                        </LazyLoad>

                    </Col>


                    <Col xl={8} lg={8} md={7} sm={7} xs={7}>
                        <div className="name">{creator.name}</div>

                        <div className="bio" style={{ textAlign: 'left' }}>
                            {creator.bio}
                        </div>

                        <div className="wallet">
                            {creator.ens ? creator.ens : creator.wallet}
                        </div>

                    </Col>

                    <Col xl={2} lg={2} md={2} sm={2} xs={2}>

                        {supporters && _supporters() !== undefined &&


                            <div>
                                <div className="supporters">
                                    {supporters[creator.wallet].length} <div className="supportersWord"> {makePlural("supporter", supporters[creator.wallet].length)}</div> 😇
                    </div>

                                <div className="amount"> {supportAmount ? supportAmount + " Ξ" : "0"}</div>
                            </div>

                        }

                    </Col>

                </Row>

            </button >

            {
                selectedCreator && selectedCreator.wallet === creator.wallet && supporters && _supporters().length > 0 &&
                <Row>
                    <Col>

                        <ul>
                            {supporters && _supporters().map((supporter: UserReserveType, index) => {

                                return (
                                    <li key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div>  {supporter.user.id.toLowerCase() === currentAccount.toLowerCase() ? "You" : <ENSAddress address={supporter.user.id} />}</div>
                                        <div style={{ marginLeft: 4, marginRight: 4 }}>
                                            redirected   {(Number(supporter.principalATokenBalance) / Math.pow(10, supporter.reserve.decimals)).toFixed(2)}

                                        </div>
                                        <div>{supporter.reserve.symbol}</div>


                                    </li>
                                )
                            })}
                        </ul>
                    </Col>
                </Row>

            }


            <style jsx>
                {`
                      .divBG {
                        width:100%;
                        padding-top:15px;
                        padding-bottom:15px;
                        background:white;
                        color:black;
                      margin-top:10px;
                      margin-bottom:10px;
                      transition:background 0.2s;
                      border-radius:16px;
                      opacity:0.7;
                      box-shadow:0px 0px 4px rgba(0, 0, 0, 0.18) !important;
                      
                    }

                    .divBGSelected {
                        opacity:1;
                        color:${themeBlack};
                        width:100%;
                        padding-top:15px;
                        padding-bottom:15px;
                        border-radius:16px;
                        background:white;
                        box-shadow:0px 0px 4px rgba(0, 0, 0, 0.4) !important;
                       
                       
                      margin-top:10px;
                      margin-bottom:10px;
                      transition:background 0.2s, color:0.2s, border 0.2s, opacity 0.2s;
                        
                    }


                    .profile {
                        width:100%;
                        border-radius:1000px;
                        max-width:100px;
                        width:100px;
                        height:100px;
                    }

                    .name {
                        text-align:left;
                        font-size:21px;
                        font-weight:bold;
                    }

                    .bio {
                        font-size:16px;
                        font-weight:300;
                    }

                    .supporters {
                        display:flex;
                        flex-direction:row;
                        justify-content:flex-end;
                        text-align:right;
                        font-size:18px;
                    }

                    .supportersWord {
                        display:block;
                        margin-left:5px;
                        margin-right:5px;
                    }

                    .amount {
                        text-align:right;
                        font-size:12px;
                    }

                    .wallet {
                        text-align:left;
                        margin-top:8px;
                        font-size:12px;
                        text-transform:uppercase;
                    }

                    @media screen and (max-width: 768px) {
                        .supportersWord {
                            display:none;
                        }

                        .name {
                            font-size:16px;
                        }

                        .bio {
                            font-size:12px;
                        }

                        .wallet {

                        }

                        .profile {
                            width:70px;
                            height:70px;
                        }
                    }

                    @media screen and (max-width:375px) {
                        .profile {
                            width:50px;
                            height:50px;
                        }
                      
                    }
                `}
            </style>


        </div >

    );
}
export default Recipient;