import React, { useEffect, useState } from "react";
import { CreatorType, SupporterType } from "../../types";
import { useStateValue } from "../../State/globalState";
import { Row, Col } from "react-bootstrap";
import { UserReserveType } from '../../types'
import { themeBlack, themeLightGray } from "../../theme";
import LazyLoad from 'react-lazyload'
import { makePlural, aTokenETHAmount } from "../../functions";
import ENSAddress from "../ENSAddress";
import useSWR from 'swr'

interface RecipientProps {
    creator: CreatorType
    supporters: SupporterType
}

const Recipient = (props: RecipientProps) => {


    const { creator, supporters } = props
    const [{ selectedCreator, currentAccount, globalWeb3 }, dispatch]:
        [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedCreator: CreatorType }, (type) => void] = useStateValue()


    const { data, error } = useSWR(creator.name, query => getBatchedBalances(), process.env.NETWORK === "main" && {
        refreshInterval: 5000
    })

    async function getBatchedBalances() {
        const batchBalanceAddress = process.env.BATCHBALANCE_ADDRESS

        const batchBalanceABI = [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "tokens",
                        "type": "address[]"
                    }
                ],
                "name": "batchBalanceOf",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]

        const batchBalanceContract = new globalWeb3.eth.Contract(batchBalanceABI, batchBalanceAddress)


        var addresses = []

        supporters.supporters.forEach((user: UserReserveType) => {
            addresses.push(user.reserve.aToken.id)
        });

        const batchBalances = await batchBalanceContract.methods.batchBalanceOf(creator.wallet, addresses).call()

        var totalEthBalance = 0

        batchBalances.forEach((amount, index) => {
            const reserve: UserReserveType = supporters.supporters[index]


            const ethBalance = aTokenETHAmount(amount, reserve.reserve.decimals, reserve.reserve.price.priceInEth)

            totalEthBalance = totalEthBalance + ethBalance
        });
        return totalEthBalance;
    }

    function _totalBalance() {
        const array = data.toFixed(10).split(".")


        return <span>
            <span style={{ fontSize: 18 }}>{array[0]}.</span>
            <span style={{ fontSize: 11 }}>{array[1]}</span>
        </span>
    }

    return (
        <div>

            <button
                className={(selectedCreator && selectedCreator.name === creator.name) ? "divBGSelected" : "divBG"}
                style={creator.pinned ? { background: 'lightyellow' } : undefined}
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

                        {creator.pinned &&
                            <div style={{ fontSize: '10px' }}>PINNED</div>
                        }


                        <LazyLoad height={200}>
                            <div style={{ display: 'flex', flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}>  <img src={`/images/${creator.img}`} className="profile" />

                            </div>

                        </LazyLoad>

                    </Col>


                    <Col xl={7} lg={8} md={5} sm={5} xs={5}>

                        <div className="wallet">
                            {creator.ens ? creator.ens : creator.wallet}
                        </div>

                        <div className="name">{creator.name}</div>

                        <div className="bio" style={{ textAlign: 'left' }}>
                            {creator.bio}
                        </div>


                        <div className="supporters">
                            {supporters.supporters ? supporters.supporters.length : 0} <div className="supportersWord"> {makePlural("supporter", supporters.supporters ? supporters.supporters.length : 0)}</div>
                        </div>



                    </Col>

                    <Col xl={3} lg={2} md={4} sm={4} xs={4}>

                        {supporters &&

                            <div>

                                <p>
                                    Total Support
                                </p>

                                <div className="amount"> {supporters.totalRedirect ? (Number(supporters.totalRedirect)).toFixed(2) + " ETH" : "0 ETH"}</div>

                                <p style={{ marginTop: 15 }}>
                                    Current balance
                                </p>




                                <div className="totalEth">
                                    {data && <div>{_totalBalance()}</div>}
                                </div>

                            </div>

                        }

                    </Col>

                </Row>

            </button >

            {
                selectedCreator && selectedCreator.wallet === creator.wallet && supporters && supporters.supporters && supporters.supporters.length > 0 &&
                <Row>
                    <Col>

                        <ul>
                            {supporters && supporters.supporters.map((supporter: UserReserveType, index) => {

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
                        p {
                            text-align:right;
                            font-size:12px;
                            text-transform:uppercase;
                            color:rgb(48, 43, 99);
                            margin-bottom:0;
                            font-weight:300;
                        }

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
                      border:solid 3px white;
                      box-shadow:0px 0px 4px rgba(0, 0, 0, 0.18) !important;
                      
                    }

                    .divBGSelected {
                      
                        color:${themeBlack};
                        width:100%;
                        padding-top:15px;
                        padding-bottom:15px;
                        border-radius:16px;
                        background:white;
                        border:solid 3px ${themeBlack};
                        box-shadow:0px 0px 4px rgba(0, 0, 0, 0.4) !important;
                       
                       
                      margin-top:10px;
                      margin-bottom:10px;
                      transition:background 0.2s, color:0.2s, border 0.2s, opacity 0.2s;
                        
                    }

                   

                    li > div {
                        font-size:14px;
                        text-transform:uppercase;
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
                        margin-right:10px;
                        overflow-wrap:anywhere;
                    }

                    .supporters {
                        display:flex;
                        flex-direction:row;
                        margin-top:10px;
                        justify-content:flex-start;
                       
                        font-size:12px;
                        text-transform:uppercase;
                    }

                    .supportersWord {
                        display:block;
                        margin-left:5px;
                        margin-right:5px;
                    }

                    .amount {
                        text-align:right;
                        font-size:16px;
                    }
                    
                    .totalEth {
                       
                        text-align:right;
                        font-size:16px;
                    }

                    .wallet {
                        text-align:left;
                        margin-top:8px;
                        font-size:12px;
                        text-transform:uppercase;
                    }

                    @media screen and (max-width: 768px) {

                        p {
                            font-size:9px;
                        }
                      
                        .name {
                            font-size:16px;
                        }

                        .bio {
                            font-size:12px;
                        }

                        .wallet {
                            font-size:10px;
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