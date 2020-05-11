import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { USER_RESERVES_INTEREST } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, User } from "../../types";
import { Col } from "react-bootstrap";
import { donateGradient } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import { smartTrim } from "../../functions";
import ATokenABI from '../../web3/ATokenABI.json'



export default function RedirectInterestModule() {

    const [{ userReserves, highestAPY, currentAccount, globalWeb3, selectedIn }, dispatch]:
        [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedIn: UserReserveType }, (type) => void] = useStateValue()

    const { loading, error, data, refetch } = useQuery(
        USER_RESERVES_INTEREST,
        {
            variables: {
                id: currentAccount ? currentAccount.toLowerCase() : undefined
            },
            pollInterval: 5000
        }
    )

    useEffect(() => {

        if (!userReserves && data) {
            //  dispatch({
            //    type: 'updateUserReserves',
            //   userReserves: data.user
            // })
        }

        if (data && data.user && data.user !== null && data.user.reserves !== null && !highestAPY) {

            const userObject: User = data.user

            const max = userObject.reserves.reduce(function (prev, current) {
                return (prev.reserve.liquidityRate > current.reserve.liquidityRate) ? prev : current
            }) //

        }


    }, [data])

    function _box() {

        // if (!data) return <div>Loading</div>
        return (
            <Col //xl={6} lg={6} md={12} sm={12} xs={12}
                style={{ boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0, minHeight: 300 }}>


                <h2 style={{ textAlign: 'center', background: donateGradient, color: 'white' }}>My aTokens ({smartTrim(currentAccount, 15)})</h2>

                <div style={{ display: 'block', padding: 10 }}>

                    <div style={{ display: 'flex' }}>

                        <Col>
                            <strong>
                                Token Name
                </strong>
                        </Col>


                        <Col>
                            <strong>
                                Amount Held
                </strong>
                        </Col>



                        <Col>
                            <strong>
                                Redirect Address
            </strong>

                        </Col>


                        {/*}  <Col>

                        </Col>

        {*/}

                    </div>

                    {data && data.user !== null && data.user.reserves && data.user.reserves !== null && data.user.reserves.map((reserve: UserReserveType, index) => {

                        const name = "a" + reserve.reserve.symbol
                        const amount = Number(reserve.principalATokenBalance) / Math.pow(10, reserve.reserve.decimals)
                        const amountInEth = Number(Number(reserve.reserve.price.priceInEth) / Math.pow(10, 18)) * amount


                        return (

                            <div className="divBG"

                                onClick={() => {

                                    if (selectedIn && reserve.reserve.symbol === selectedIn.reserve.symbol) {
                                        dispatch({
                                            type: "updateSelectedIn",
                                            selectedIn: undefined
                                        })
                                    }

                                    else {
                                        dispatch({
                                            type: "updateSelectedIn",
                                            selectedIn: reserve
                                        })
                                    }


                                    dispatch({
                                        type: "updateCurrentSwap",
                                        currentSwap: undefined
                                    })


                                }}



                            >




                                <Col>
                                    <div style={{ textAlign: 'left' }}>{name}</div>
                                </Col>

                                <Col>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>


                                        {amount.toFixed(4)}
                                        <div style={{ fontSize: '10px' }}>
                                            ({amountInEth.toFixed(4)} ETH)
                      </div>
                                    </div>
                                </Col>



                                <Col>
                                    <div>
                                        {smartTrim(reserve.interestRedirectionAddress, 10)}
                                    </div>

                                </Col>



                                {/*}
                                <Col>
                                    <button onClick={() => setRedirectAddress(reserve)}>
                                        Update
                                    </button>

                                </Col>
                            {*/}



                            </div>

                        )



                    })}



                    <style jsx>{`

                    .divBG {
                        width:100%;
                        padding-top:10px;
                        padding-bottom:10px;
                    }

                    .divBG:nth-child(odd) {
                        background:whitesmoke;
                    }

            section {
              padding-bottom: 20px;
            }
            li {
              display: block;
              margin-bottom: 10px;
            }
            div {
              align-items: center;
              display: flex;
            }
            a {
              font-size: 14px;
              margin-right: 10px;
              text-decoration: none;
              padding-bottom: 0;
              border: 0;
            }
            span {
              font-size: 14px;
              margin-right: 5px;
            }
            ul {
              margin: 0;
              padding: 0;
            }
    
            button {
            
            }
    
           
    
            .buttonSelected {
              background:#303952;
              color:white;
            }
    
            .buttonUnselected {
    
            }
           
          `}</style>

                </div>
            </Col >
        )
    }



    if (error) return <ErrorMessage message="Error loading posts." />


    return _box()
}


