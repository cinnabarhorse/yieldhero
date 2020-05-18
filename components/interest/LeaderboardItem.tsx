import React, { useEffect, useState } from "react";
import { UserReserveType, LeaderboardUser } from "../../types";
import ENSAddress from "../ENSAddress";
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { themeBlack, themeLightGray } from "../../theme";
import { makePlural } from "../../functions";
import { useStateValue } from "../../State/globalState";
import { Row, Col } from "react-bootstrap";

interface LeaderboardItemProps {
    user: LeaderboardUser
    index: number
}

const LeaderboardItem = (props: LeaderboardItemProps) => {

    const [{ selectedLeaderboard, currentAccount }, dispatch] = useStateValue()

    const { user, index } = props

    function _indexColor(index) {
        if (index === 0) return "gold"
        if (index === 1) return "silver"
        if (index === 2) return "brown"
        else return "whitesmoke"
    }

    return (

        <div>


            <button onClick={() => {



                if (selectedLeaderboard && selectedLeaderboard === user.address) {
                    dispatch({
                        type: "updateSelectedLeaderboard",
                        selectedLeaderboard: undefined
                    })
                }

                else {
                    dispatch({
                        type: "updateSelectedLeaderboard",
                        selectedLeaderboard: user.address
                    })
                }


            }}

                className={selectedLeaderboard === user.address ? "divBGSelected" : "divBG"}>


                <div className="jazzicon">
                    <Jazzicon diameter={44} seed={jsNumberForAddress(user.address)} />
                </div>

                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="address">
                        <ENSAddress trim={20} address={user.address} />
                    </div>

                    <div className="redirecting">
                        {user.user.length} {makePlural("redirect", user.user.length).toUpperCase()}, total {user.amount && Number(user.amount).toFixed(4)} ETH
                </div>


                </div>

                <div className="medal">
                    {index + 1}
                </div>


            </button>

            {
                selectedLeaderboard && selectedLeaderboard === user.address && user.user.length > 0 &&
                <Row>
                    <Col>

                        <ul>
                            {user.user.map((recipient: UserReserveType, index) => {

                                return (
                                    <li key={index} style={{ display: 'flex', flexDirection: 'row' }}>

                                        <div style={{ fontWeight: 700 }}>
                                            {(Number(recipient.principalATokenBalance) / Math.pow(10, recipient.reserve.decimals)).toFixed(2)}
                                        </div>
                                        <div style={{ fontWeight: 700, marginLeft: 4, marginRight: 4 }}>{recipient.reserve.symbol}</div>

                                        <div style={{ marginLeft: 0, marginRight: 4, fontWeight: 300 }}>
                                            redirected to
                                        </div>


                                        <div>
                                            <ENSAddress address={recipient.interestRedirectionAddress} />
                                        </div>



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

                    li > div {
                        font-size:14px;
                        text-transform:uppercase;
                    }

                    .jazzicon {
                        border:solid 3px rgb(48, 43, 99);
                        border-radius:25px;
                        margin-right: 15px;
                        margin-left: 15px;
                       height:50px;
                       width:auto;
                    }

                    .medal {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 21px;
                        background: ${_indexColor(index)};
                        width: 50px;
                        height: 50px;
                        margin: 20px;
                        border-radius: 25px;
                        border:solid 2px whitesmoke;
                    }

                    .address {
                        font-size: 18px;
                        font-weight: 800;
                    }

                    .redirecting {
                        text-transform:uppercase;
                        font-size:12px;
                    }


                    @media screen and (max-width:551px) {
                        .medal {
                            width:40px;
                            height:40px;
                            border-radius:20px;
                            margin:10px;
                        }
                    }

                    @media screen and (max-width:375px) {
                        .medal {
                            width:30px;
                            height:30px;
                            border-radius:15px;
                            margin:5px;
                        }

                        .jazzicon {
                            overflow:hidden;
                            height:30px;
                            width:30px;
                            margin-left:10px;
                            margin-right:10px;
                        }

                        .address {
                            font-size:15px;
                        }

                        .redirecting {
                            font-size:12px;
                        }
                    }
                `}
            </style>



        </div>










    );
}
export default LeaderboardItem;