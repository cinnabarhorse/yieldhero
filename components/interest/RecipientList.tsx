import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { RECIPIENT_REDIRECTS } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, CreatorType } from "../../types";
import { Col, Row, } from "react-bootstrap";
import { donateGradient } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import { addresses } from './addresses'
import Recipient from "./Recipient";
import NextStyledInput from "../NextStyledInput";
import YieldLeaderboard from "./YieldLeaderboard";



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

    useEffect(() => {

        if (data) {

            const dataObject: UserReserveType[] = data.userReserves
            var finalRedirects = {}

            addresses.forEach((address, index) => {
                const redirects = dataObject.filter((obj) => {

                    return obj.interestRedirectionAddress.toLowerCase() === address.wallet.toLowerCase()
                })

                finalRedirects[address.wallet] = redirects


            });


            setSupporters(finalRedirects)

        }


    }, [data])

    function _box() {

        return (
            <Col style={{ background: 'ghostwhite', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0 }}>



                <div style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, background: donateGradient }}>

                    <Row>
                        <Col xl={4} lg={4} md={4} sm={1} xs={0}></Col>
                        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}> <h2 style={{ color: 'white', textAlign: 'center', padding: 0, margin: 0 }}>{page === "set" ? "SELECT A YIELD RECIPIENT" : "YIELD HERO LEADERBOARD"}</h2></Col>
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

                    {page === "set" && addresses.map((creator: CreatorType) => {

                        return (

                            <Recipient supporters={supporters} creator={creator} />
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


