import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { USER_RESERVES_INTEREST } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType } from "../../types";
import { Col } from "react-bootstrap";
import { donateGradient, themeBlack } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import ENSAddress from "../ENSAddress";
import Box from "../Box";



export default function TokenList() {

    const [{
        selectedToken,
        currentAccount,
    }, dispatch]:
        [{ selectedToken: UserReserveType, globalWeb3: any, currentAccount: any }, (type) => void] = useStateValue()



    const { loading, error, data, refetch } = useQuery(
        USER_RESERVES_INTEREST,
        {
            skip: !currentAccount ? true : false,
            variables: {
                id: currentAccount ? currentAccount.toLowerCase() : undefined
            },
            pollInterval: 5000
        }
    )

    console.log('data:', data)

    function _box() {

        return (

            <Box
                title={<div>
                    <strong>Step 1)</strong> Select Token to Redirect
                </div>}
                background={donateGradient}

            >

                {!loading && !data &&
                    <div style={{ height: 120 }}>Connect your wallet to redirect yield!</div>
                }



                {!data && loading &&
                    <div style={{ height: 120 }}>Loading your tokens...</div>
                }


                {data && data.user !== null && data.user.reserves && data.user.reserves !== null && data.user.reserves.map((reserve: UserReserveType, index) => {

                    const name = "a" + reserve.reserve.symbol
                    const amount = Number(reserve.principalATokenBalance) / Math.pow(10, reserve.reserve.decimals)
                    const amountInEth = Number(Number(reserve.reserve.price.priceInEth) / Math.pow(10, 18)) * amount

                    console.log('name:', name)

                    return (

                        <Col key={index}>


                            <button className={(selectedToken && selectedToken.id === reserve.id) ? "divBGSelected" : "divBG"}

                                onClick={() => {

                                    if (selectedToken && reserve.reserve.symbol === selectedToken.reserve.symbol) {
                                        dispatch({
                                            type: "updateSelectedToken",
                                            selectedToken: undefined
                                        })
                                    }

                                    else {
                                        dispatch({
                                            type: "updateSelectedToken",
                                            selectedToken: reserve
                                        })
                                    }

                                }}



                            >

                                <img className="coinImage" src={`/coins/a${reserve.reserve.symbol}.svg`} />

                                <div className="name" style={{ textAlign: 'left' }}>{name}</div>



                                <div className="amountContainer">


                                    <div className="amount">
                                        <span style={{ fontSize: '21px' }}>{amount.toFixed(4).split(".")[0]}</span>
                                        <span style={{ fontSize: '10px' }}>.{amount.toFixed(4).split(".")[1]}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '10px' }}>
                                        ({amountInEth.toFixed(4)} ETH)
                      </div>
                                </div>





                                <div className="wallet">
                                    {reserve.interestRedirectionAddress === "0x0000000000000000000000000000000000000000" ?
                                        <div>No Redirect</div>
                                        :

                                        <ENSAddress address={reserve.interestRedirectionAddress} />


                                    }


                                </div>




                            </button>


                        </Col>
                    )



                })}

                {data && data.user === null &&
                    <div style={{ height: 120 }}>You don't have any aTokens!</div>
                }



                <style jsx>{`

                    .divBG {
                      width:100%;
                      min-width:150px;
                      max-width:200px;
                        display:flex;
                        align-items:center;
                        flex:1;
                        flex-direction:column;
                      
                        color:black;
                        background:white;
                      
                        border-radius:16px;
                        border:solid 3px white;
                       
                        box-shadow:0px 0px 4px rgba(0, 0, 0, 0.18) !important;
                        margin-bottom:15px;
                    }

                    .divBGSelected {
                        border:solid 3px ${themeBlack};
                        min-width:150px;
                        max-width:200px;
                        width:100%;
                        border-radius:16px;
                      
                        display:flex;
                        align-items:center;
                        flex:1;
                        flex-direction:column;
                       color:${themeBlack};
                    
                        box-shadow:0px 0px 4px rgba(0, 0, 0, 0.25) !important;
                         background:white;
                        transition:background 0.2s, border 0.2s;
                    }

                    .name {
                        margin-top:10px;
                        font-weight:bold;
                        font-size:16px;
                        text-align:center;
                    }

                    .coinImage {
                        margin-top:10px;
                        height:60px;

                    }

                    .amountContainer {
                        display:flex;
                        flex-direction:column;
                    }

                    .amount {
                        font-size:24px;
                    }

                    .wallet {
                        margin-top:20px;
                    }

                    @media screen and (max-width:375px) {
                        .divBG {
                            max-width:unset;
                        }

                        .divBGSelected {
                            max-width:unset;
                        }
                    }

           
           
          `}</style>

            </Box>

        )


    }



    if (error) return <ErrorMessage message="Error loading posts." />

    return _box()
}


