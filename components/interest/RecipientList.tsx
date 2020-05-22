import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { RECIPIENT_REDIRECTS } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, CreatorType, SupporterType } from "../../types";
import { Col, Row, } from "react-bootstrap";
import { donateGradient } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import { addresses } from './addresses'
import Recipient from "./Recipient";
import NextStyledInput from "../NextStyledInput";
import YieldLeaderboard from "./YieldLeaderboard";
import { aTokenETHAmount } from "../../functions";



export default function RecipientList() {

    const [{ selectedCreator }, dispatch]:
        [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedCreator: CreatorType }, (type) => void] = useStateValue()

    const [supporters, setSupporters] = useState(undefined)

    const [addressArray, setAddressArray] = useState(undefined)
    const [page, setPage] = useState<"set" | "leaderboard">("set")

    useEffect(() => {
        //set addresses

        var addressList = addresses.map((obj) => { return obj.wallet })

        var filteredAddresses = addressList.filter((address) => {
            return address !== ""
        })

        setAddressArray(filteredAddresses)
    }, [])



    const { loading, error, data, } = useQuery(
        RECIPIENT_REDIRECTS,
        {
            skip: !addressArray ? true : false,
            variables: {
                addressArray: addressArray
            },
            pollInterval: process.env.NETWORK === "kovan" ? 0 : 10000,
            fetchPolicy: 'network-only',
            notifyOnNetworkStatusChange: true
        }
    )


    //Sort the recipients by highest amoount of redirect they're receiving
    useEffect(() => {

        if (data) {

            const dataObject: UserReserveType[] = data.userReserves
            var finalRedirects: SupporterType[] = []

            addresses.forEach((creator: CreatorType, index) => {
                //Group redirects by their destination address
                const redirects = dataObject.filter((obj) => {
                    return obj.interestRedirectionAddress.toLowerCase() === creator.wallet.toLowerCase()
                })

                //In ETH
                let totalRedirect = 0

                //Calculate amount in Ether
                redirects.forEach((redirect) => {
                    const ethAmount = aTokenETHAmount(redirect.principalATokenBalance, redirect.reserve.decimals, redirect.reserve.price.priceInEth)
                    totalRedirect = totalRedirect + ethAmount

                });

                finalRedirects.push({
                    creator: creator,
                    address: creator.wallet,
                    supporters: redirects,
                    totalRedirect: totalRedirect
                })
            });


            const sortedSupporters = finalRedirects.sort(function (a, b) { return b.totalRedirect - a.totalRedirect });


            setSupporters(sortedSupporters)

        }


    }, [data])

    function _box() {

        return (
            <Col style={{ background: 'ghostwhite', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0 }}>



                <div style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, background: donateGradient }}>

                    <Row>
                        <Col xl={4} lg={4} md={4} sm={1} xs={0}></Col>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}> <h2 style={{ color: 'white', textAlign: 'center', padding: 0, margin: 0 }}>{page === "set" ? <div><strong>STEP 2)</strong> SELECT A YIELD RECIPIENT
                            </div> : "YIELD HERO LEADERBOARD"}</h2></Col>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <button
                                className="actionButton"
                                onClick={() => setPage(page === "set" ? "leaderboard" : "set")}>
                                {page === "set" ? "View Leaderboard" : "Send yield"}
                            </button>
                        </Col>
                    </Row>



                </div>



                <div style={{ display: 'block', padding: 10 }}>

                    {page === "set" &&
                        <div className="customContainer">

                            <NextStyledInput
                                inputLabel="Custom Address"
                                placeHolderText="Input a valid Ethereum address"
                                onChangeText={(text) => {

                                    console.log('text:', text)

                                    if (text === "" || text === undefined) {

                                        console.log('empty!')
                                        dispatch({
                                            type: "updateSelectedCreator",
                                            selectedCreator: undefined
                                        })
                                    }


                                    else {
                                        dispatch({
                                            type: "updateSelectedCreator",
                                            selectedCreator: {
                                                name: undefined,
                                                bio: undefined,
                                                wallet: text,
                                                ens: undefined,
                                                img: undefined
                                            }
                                        })
                                    }





                                }}
                                value={selectedCreator ? selectedCreator.wallet : undefined}
                                inputFieldStyles={`
                                    width:100%;
                                    height:60px;
                                    background:white;
                                    font-size:16px;
                                    box-shadow:0px 0px 4px rgba(0, 0, 0, 0.18) !important;
                                    border:none;
                 
              `}
                            />

                        </div>

                    }

                    {page === "set" && supporters && supporters.map((redirect: SupporterType) => {

                        return (

                            <Recipient supporters={supporters.find((supporter: SupporterType) => {
                                return redirect.address.toLowerCase() === supporter.address.toLowerCase()
                            })} creator={redirect.creator} />
                        )



                    })}

                    {page === "leaderboard" &&
                        <YieldLeaderboard />
                    }




                </div>

                <style>
                    {`

                        h2 {
                            font-size:17px;
                            font-weight:300;
                            letter-spacing:1px;
                            text-transform:uppercase;
                        }

                        .actionButton {
                            font-weight:700;
                            background: none;
                            padding: 8px;
                            margin-right: 30px;
                            color:white;
                            font-size:14px;
                            letter-spacing:1.2px;
                            text-transform:uppercase;
                            opacity:0.8;
                            transition:opacity 0.2s;
                        }

                        .actionButton:hover {
                            opacity:1;
                        }

                        .customContainer {
                            width:100%;
                            height:100px;
                        }
                    `}
                </style>
            </Col >
        )
    }



    if (error) return <ErrorMessage message="Error loading posts." />


    return _box()
}


