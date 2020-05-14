import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { RECIPIENT_REDIRECTS } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, CreatorType } from "../../types";
import { Col, } from "react-bootstrap";
import { donateGradient } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import { addresses } from './addresses'
import Recipient from "./Recipient";
import NextStyledInput from "../NextStyledInput";



export default function RecipientList() {

    const [{ selectedCreator, highestAPY, currentAccount, globalWeb3 }, dispatch]:
        [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedCreator: CreatorType }, (type) => void] = useStateValue()

    const [supporters, setSupporters] = useState(undefined)

    const [addressArray, setAddressArray] = useState(undefined)

    useEffect(() => {
        //set addresses

        var addressList = addresses.map((obj) => { return obj.wallet })

        var filteredAddresses = addressList.filter((address) => {
            return address !== ""
        })

        setAddressArray(filteredAddresses)
    }, [])



    const { loading, error, data, refetch } = useQuery(
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

            console.log('final redirects:', finalRedirects)

            setSupporters(finalRedirects)

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


