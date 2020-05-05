import React, { useEffect, useState } from "react";
import { useStateValue } from "../State/globalState";
import { UserReserveType, ReserveType, TradeState } from "../types";
import { Row, Col } from "react-bootstrap";
import { buttonInactive, themeBlack } from "../theme";
import BPoolABI from '../web3/BPool.json'
import NextStyledInput from "./NextStyledInput";

interface SwapButtonProps {

}

const SwapButton = (props: SwapButtonProps) => {

    const [{
        currentSwap, //The current swap used for the interface
        availableSwaps, //All available swaps for this trade
        globalWeb3,
        selectedIn,
        selectedOut,
        currentAccount
    }, dispatch]: [{
        currentSwap: any,
        availableSwaps: any,
        globalWeb3: any,
        selectedIn: UserReserveType,
        selectedOut: ReserveType,
        currentAccount: string
    }, (type) => void] = useStateValue()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const [swapAmount, setSwapAmount] = useState(undefined)

    const [tradeState, setTradeState] = useState<TradeState>(undefined)


    function sameSelected() {
        return selectedOut.symbol === selectedIn.reserve.symbol
    }

    function bothSelected() {
        return selectedIn && selectedOut
    }

    function oneSelected() {
        return (selectedIn && !selectedOut) || (selectedOut && !selectedIn) || (!selectedIn && !selectedOut)
    }

    useEffect(() => {

        setLoading(true)

        if (bothSelected() && !sameSelected() && swapAmount && swapAmount !== "" && swapAmount !== "0") {
            setError(undefined)
            getSwap()
        }
        else setLoading(false)


    }, [selectedIn, selectedOut, swapAmount])


    async function getSwap() {


        setLoading(true)


        const sor = require('@balancer-labs/sor');
        const BigNumber = require('bignumber.js');
        const ethers = require('ethers');

        const MAX_UINT = ethers.constants.MaxUint256;

        // MAINNET
        const tokenIn = selectedIn.reserve.aToken.id
        const tokenOut = selectedOut.aToken.id

        try {


            const data = await sor.getPoolsWithTokens(tokenIn, tokenOut);

            const poolData = sor.parsePoolData(data.pools, tokenIn, tokenOut);


            console.log('pool data:', poolData)


            //Input all of our in asset
            //  const inputAmount = new BigNumber(selectedIn.principalATokenBalance)

            const inputAmount = new BigNumber(Number(swapAmount) * Math.pow(10, selectedIn.reserve.decimals))

            console.log('input:', inputAmount)

            const sorSwaps = sor.smartOrderRouter(
                poolData,
                'swapExactIn',
                inputAmount,
                1,
                0
            );

            console.log('sor swaps:', sorSwaps)

            const swaps = sor.formatSwapsExactAmountIn(sorSwaps, MAX_UINT, 0)



            console.log('swaps:', swaps)

            if (swaps.length > 0) {
                setError(undefined)
                const expectedOut = sor.calcTotalOutput(swaps, poolData)

                console.log('expected out:', expectedOut)

                dispatch({
                    type: "updateAvailableSwaps",
                    availableSwaps: swaps
                })


                dispatch({
                    type: "updateCurrentSwap",
                    currentSwap: {
                        amountIn: Number(swapAmount) * Math.pow(10, selectedIn.reserve.decimals),
                        amountOut: expectedOut
                    }
                })


                setLoading(false)

                //   alert(`Trade ${inputAmount / Math.pow(10, selectedIn.reserve.decimals)} ${selectedIn.reserve.symbol} for ${(expectedOut / Math.pow(10, selectedOut.decimals)).toFixed(3)} ${selectedOut.symbol}?`)
            }
            else {
                setError("No available trade.")

                dispatch({
                    type: "updateAvailableSwaps",
                    availableSwaps: undefined
                })

                dispatch({
                    type: "updateCurrentSwap",
                    currentSwap: undefined
                })


                setLoading(false)
            }



        } catch (error) {
            console.log('error:', error)
            setError("No available trade.")
            setLoading(false)

        }




    }


    async function performSwap() {

        setTradeState("waitingConfirm")

        const pool = new globalWeb3.eth.Contract(BPoolABI, "0x7d3fd22fbc32fd112696e8e7cfc7eb7f50c657b2")

        const tokenInAddress = selectedIn.reserve.aToken.id
        const tokenOutAddress = selectedOut.aToken.id

        pool.methods.swapExactAmountIn(
            // availableSwaps, //All swaps from the SOR
            tokenInAddress,
            currentSwap.amountIn.toString(),
            tokenOutAddress,
            currentSwap.amountOut.toString(),
            availableSwaps[0].maxPrice
        ).send({
            from: currentAccount
        })
            .on('transactionHash', async function (newHash) {

                setTradeState("trading")

            })

            .on('receipt', async function (receipt) {

                alert("Swap complete!")
                setTradeState(undefined)

            })
            .on('error', async function (error) {

                setTradeState(undefined)
                alert(error.message)
            })


    }

    function _buttonTitle() {

        if (oneSelected()) return <div>Select a pair to swap</div>
        else if (bothSelected() && !swapAmount || swapAmount === "0") return <div>Input amount to swap</div>
        else if (!tradeState && bothSelected() && currentSwap && !loading && !sameSelected()) return (
            <div>
                Swap {(currentSwap.amountIn / Math.pow(10, selectedIn.reserve.decimals)).toFixed(3)} {selectedIn.reserve.symbol} for {(currentSwap.amountOut / Math.pow(10, selectedOut.decimals)).toFixed(3)} {selectedOut.symbol}
            </div>
        )
        else if (!tradeState && bothSelected() && sameSelected()) return (
            <div>
                Cannot trade the same asset.
            </div>
        )
        else if (loading) return <div>Loading...</div>
        else if (bothSelected() && error) return <div> {error} </div>
        else if (tradeState === "waitingConfirm") return (
            <div>Waiting to approve...</div>
        )
        else if (tradeState === "trading") return (
            <div>Swapping in progress...</div>
        )

    }

    function _buttonDisabled() {
        if (loading) return true
        if (oneSelected()) return true
        if (!currentSwap) return true
        if (tradeState !== undefined) return true
        if (!swapAmount || swapAmount === "") return true
        if (swapAmount === "0") return true
        return false
    }

    return (

        <Row style={{ marginTop: 30 }}>

            <Col xl={2} lg={2} md={3} sm={12} xs={12}>

                <NextStyledInput
                    placeHolderText="Swap amount"
                    value={swapAmount}
                    onChangeText={(text) => setSwapAmount(text)}
                    inputFieldStyles={`
                    background:white;
                   
                    height:60px;
                    font-size:16px;
                    width:100%;
               `}
                />
            </Col>

            <Col xl={10} lg={10} md={9} sm={12} xs={12}>


                <button disabled={_buttonDisabled()}
                    onClick={() => performSwap()}
                >

                    {_buttonTitle()}


                    <style jsx>
                        {`
                    button {
                        background:#303952;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        width:100%;
                        height:60px;
                      
                        box-shadow:0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15);
                        transition:background 0.2s;
                        
                    }

                    button:disabled {
                        background:${buttonInactive};
                    }

                    button:active {
                        background-color: #283352;
                    }
                    
                `}
                    </style>

                </button>

            </Col>



        </Row>

    );
}
export default SwapButton;