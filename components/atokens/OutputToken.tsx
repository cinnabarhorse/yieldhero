import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ALL_RESERVES } from "../../graphql/queries";
import ErrorMessage from "../ErrorMessage";
import { Col } from "react-bootstrap";
import { useStateValue } from '../../State/globalState'
import { ReserveType, UserReserveType } from '../../types'
import { swapGradient } from "../../theme";

interface ReservesProps {

}

interface Reserve {
    id: string
    symbol: string
    name: string
    decimals: number
    variableBorrowRate: string
    stableBorrowRate: string
    liquidityRate: string
}

const Reserves = (props: ReservesProps) => {


    const [{ selectedIn, currentAccount, userReserves, reservePools, highestAPY, selectedOut }, dispatch]: [{ selectedIn: UserReserveType, currentAccount: string, userReserves: any, reservePools: any, highestAPY: any, selectedOut: ReserveType }, (type) => void] = useStateValue()

    const { error, data } = useQuery(
        ALL_RESERVES,
        {
            context: { clientName: "aave" },
            notifyOnNetworkStatusChange: true,
        }
    )

    useEffect(() => {

        if (data && !reservePools) {
            dispatch({
                type: "updateReservePools",
                reservePools: data.reserves
            })
        }
    }, [data])

    if (error) return <ErrorMessage message="Error loading posts." />

    function _box() {
        return (
            <Col

                style={{ boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0, opacity: selectedIn ? 1.0 : 0.3, transition: "opacity 0.3s", minHeight: 300 }}>

                <h2 style={{ textAlign: 'center', background: swapGradient, color: 'white' }}>Select Output aToken</h2>

                <div style={{ display: 'block', padding: 10, }}>


                    <div style={{ display: 'flex' }}>




                        <Col>
                            <strong>
                                Token Name
    </strong>
                        </Col>


                        <Col>
                            <strong>
                                Deposit APY
</strong>

                        </Col>
                    </div>

                    {data && data.reserves && userReserves && highestAPY && data.reserves.map((reserve: Reserve, index) => {

                        const liquidityRate = Number(reserve.liquidityRate) / Math.pow(10, 27) * 100

                        const availableTokens = [
                            "usdt", "dai", "susd", "usdc", "tusd", "busd"
                        ]


                        if (!availableTokens.includes(reserve.symbol.toLowerCase())) return null

                        return (
                            <button
                                key={index}
                                style={{ width: '100%', marginTop: 10, marginBottom: 10 }}

                                disabled={selectedIn ? false : true}
                                className={selectedOut && selectedOut.symbol === reserve.symbol ? "buttonSelected" : "buttonUnselected"}
                                onClick={() => {

                                    if (selectedOut && reserve.symbol === selectedOut.symbol) {
                                        dispatch({
                                            type: "updateSelectedOut",
                                            selectedOut: undefined
                                        })
                                    }
                                    else {
                                        dispatch({
                                            type: "updateSelectedOut",
                                            selectedOut: reserve
                                        })
                                    }


                                    dispatch({
                                        type: "updateCurrentSwap",
                                        currentSwap: undefined
                                    })



                                    // swap()
                                }}

                            >


                                <Col>

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <img style={{ height: 40, marginLeft: -10, marginRight: 8 }} src={`/coins/${reserve.symbol.toLowerCase()}.svg`} />
                                        <div style={{ textAlign: 'left' }}>{"a" + reserve.symbol}</div>
                                    </div>


                                </Col>


                                {/*}
                            <Col>
                                {((Number(reserve.stableBorrowRate) / Math.pow(10, 27)) * 100).toFixed(3)}%
                        </Col>




                            <Col>
                                {((Number(reserve.variableBorrowRate) / Math.pow(10, 27)) * 100).toFixed(3)}%
                    </Col>

                    {*/}


                                <Col>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        {liquidityRate.toFixed(3)}%  {liquidityRate > 5 && <span>🔥</span>}
                                    </div>

                                </Col>

                            </button>

                        )
                        // }




                    })}


                    <style jsx>
                        {`
                  
                    button {
                        background:none;
                        color:#303952;
                        margin-top:10px;
                        margin-bottom:10px;
                        transition: box-shadow 0.2s;
                    }
            
                    button:hover {
                        box-shadow:rgba(182, 80, 158, 0.5) 0px 2px 10px 0px !important
                    }

                    .buttonSelected {
                        background:#303952;
                        color:white;
                    }

                   
                `}
                    </style>

                </div>


            </Col>
        )

    }

    return _box()

}
export default Reserves;