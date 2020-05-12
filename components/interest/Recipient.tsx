import React, { useEffect, useState } from "react";
import { CreatorType } from "../../types";
import { useStateValue } from "../../State/globalState";
import { Row, Col } from "react-bootstrap";
import { UserReserveType } from '../../types'
import { themeBlack } from "../../theme";
import LazyLoad from 'react-lazyload'

interface RecipientProps {
    creator: CreatorType
    supporters: any
}

const Recipient = (props: RecipientProps) => {


    const { creator, supporters } = props
    const [{ selectedCreator, highestAPY, currentAccount, globalWeb3 }, dispatch]:
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

    if (currentAccount === creator.wallet) return null;

    return (
        <button
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
            className={(selectedCreator && selectedCreator.name === creator.name) ? "divBGSelected" : "divBG"}>

            <Row style={{ marginLeft: 0, marginRight: 0, width: '100%' }}>

                <Col xl={2} lg={2} md={3} sm={3} xs={3}>
                    <LazyLoad height={200}>
                        <img src={`/images/${creator.img}`} className="profile" />
                    </LazyLoad>

                </Col>


                <Col xl={8} lg={8} md={7} sm={7} xs={7}>
                    <div className="name">{creator.name}</div>

                    <div style={{ textAlign: 'left' }}>
                        {creator.bio}
                    </div>

                    <div className="wallet">
                        {creator.ens ? creator.ens : creator.wallet}
                    </div>

                </Col>

                <Col xl={2} lg={2} md={2} sm={2} xs={2}>

                    {supporters && supporters[creator.wallet] !== undefined &&


                        <div>
                            <div className="supporters">
                                {supporters[creator.wallet].length} 😇
                    </div>

                            <div className="amount"> {supportAmount ? supportAmount + " Ξ" : "0"}</div>
                        </div>

                    }

                </Col>

            </Row>

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
                    }

                    .name {
                        text-align:left;
                        font-size:21px;
                        font-weight:bold;
                    }

                    .supporters {
                        text-align:right;
                        font-size:18px;
                    }

                    .amount {
                        text-align:right;
                        font-size:14px;
                    }

                    .wallet {
                        text-align:left;
                    }
                `}
            </style>

        </button>

    );
}
export default Recipient;