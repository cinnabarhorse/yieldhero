import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { USER_RESERVES_INTEREST, RECIPIENT_REDIRECTS } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, User, CreatorType } from "../../types";
import { Col, Row } from "react-bootstrap";
import { donateGradient, themeBlack } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import ATokenABI from '../../web3/ATokenABI.json'
import { addresses } from './addresses'
import Recipient from "./Recipient";
import NextStyledInput from "../NextStyledInput";



export default function RecipientList() {

    const [{ selectedCreator, highestAPY, currentAccount, globalWeb3 }, dispatch]:
        [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedCreator: CreatorType }, (type) => void] = useStateValue()

    const [supporters, setSupporters] = useState(undefined)

    const { loading, error, data, refetch } = useQuery(
        RECIPIENT_REDIRECTS,
        {
            variables: {
                addressArray: ["0xc3c2e1cf099bc6e1fa94ce358562bcbd5cc59fe5", "0x94cb5c277fcc64c274bd30847f0821077b231022", "0x51208e5cc9215c6360210c48f81c8270637a5218",
                    "0x77dcb3ac387f7da0737948ac897d8eadd4ce4264"
                ]
            },
            //pollInterval: 5000
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

            console.log('final redirects:', finalRedirects)

        }


    }, [data])

    function _box() {

        return (
            <Col style={{ background: 'ghostwhite', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0 }}>


                <h2 style={{ textAlign: 'center', background: donateGradient, color: 'white' }}>Select a Yield Recipient</h2>

                <div style={{ display: 'block', padding: 10 }}>

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

                    {addresses.map((creator: CreatorType) => {

                        return (

                            <Recipient supporters={supporters} creator={creator} />
                        )



                    })}




                </div>

                <style>
                    {`
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


