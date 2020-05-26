import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { RECIPIENT_REDIRECTS } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, CreatorType, SupporterType } from "../../types";
import { donateGradient } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import { addresses } from './addresses'
import Recipient from "./Recipient";
import NextStyledInput from "../NextStyledInput";
import { aTokenETHAmount } from "../../functions";
import Box from "../Box";
import Router from "next/router";



export default function RecipientList() {

    const [{ selectedCreator }, dispatch]:
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

            <Box
                buttonRight="View Leaderboard"
                buttonRightAction={() => Router.push("/leaderboard")}
                title={<div>
                    <strong>Step 2)</strong> Select a yield recipient

                </div>}
                background={donateGradient}
            >

                <div style={{ display: 'block', padding: 10, width: '100%' }}>


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



                    {supporters && supporters.map((redirect: SupporterType) => {

                        return (

                            <Recipient supporters={supporters.find((supporter: SupporterType) => {
                                return redirect.address.toLowerCase() === supporter.address.toLowerCase()
                            })} creator={redirect.creator} />
                        )



                    })}

                </div>

            </Box>
        )
    }



    if (error) return <ErrorMessage message="Error loading posts." />


    return _box()
}


