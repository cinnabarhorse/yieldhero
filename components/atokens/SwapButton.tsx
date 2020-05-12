import React, { useEffect, useState } from "react";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, ReserveType, TradeState } from "../../types";
import { Row, Col } from "react-bootstrap";
import { buttonInactive, themeBlack } from "../../theme";
import BPoolABI from '../../web3/BPool.json'
import NextStyledInput from "../NextStyledInput";
import ATokenABI from '../../web3/ATokenABI.json'

import BigNumber from 'bignumber.js'

interface SwapButtonProps {

}

const SwapButton = (props: SwapButtonProps) => {

    const [{
        currentSwap, //The current swap used for the interface
        availableSwaps, //All available swaps for this trade
        globalWeb3,
        selectedIn,
        selectedOut,
        currentAccount,
    }, dispatch]: [{
        currentSwap: any,
        availableSwaps: any,
        globalWeb3: any,
        selectedIn: UserReserveType,
        selectedOut: ReserveType,
        currentAccount: string,
    }, (type) => void] = useStateValue()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const [swapAmount, setSwapAmount] = useState(undefined)
    const [tradeState, setTradeState] = useState<TradeState>(undefined)

    const [allowance, setAllowance] = useState(undefined)


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


    useEffect(() => {

        if (selectedIn) {
            fetchAllowance()
        }


    }, [selectedIn])

    async function fetchAllowance() {

        const poolAddress = process.env.POOL_ADDRESS

        //First check if this token is approved
        const ERC20 = new globalWeb3.eth.Contract(ATokenABI, selectedIn.reserve.aToken.id)

        console.log('erc 20:', ERC20)

        const allowance = await ERC20.methods.allowance(currentAccount, poolAddress).call({ from: currentAccount })

        setAllowance(allowance)
    }

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


        const poolAddress = process.env.POOL_ADDRESS

        if (Number(allowance) === 0) {

            const ERC20 = new globalWeb3.eth.Contract(ATokenABI, selectedIn.reserve.aToken.id)

            const approveValue = new BigNumber(swapAmount * Math.pow(10, selectedIn.reserve.decimals)).toString()
            console.log('approve value:', approveValue)

            setTradeState("waitingConfirm")

            ERC20.methods.approve(poolAddress, approveValue)
                .send({
                    from: currentAccount
                })
                .on('transactionHash', async function (newHash) {
                    setTradeState("approving")
                })

                .on('receipt', async function (receipt) {

                    alert("Transaction complete!")
                    setTradeState(undefined)
                    setAllowance(approveValue)

                })
                .on('error', async function (error) {

                    setTradeState(undefined)
                    alert(error.message)
                })

        }

        else {

            setTradeState("waitingConfirm")

            const pool = new globalWeb3.eth.Contract(BPoolABI, poolAddress)

            const tokenInAddress = selectedIn.reserve.aToken.id
            const tokenOutAddress = selectedOut.aToken.id

            pool.methods.swapExactAmountIn(
                // availableSwaps, //All swaps from the SOR
                tokenInAddress,
                currentSwap.amountIn.toFixed(),
                tokenOutAddress,
                currentSwap.amountOut.toFixed(),
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

                    dispatch({
                        type: "updateCurrentSwap",
                        currentSwap: undefined
                    })
                    setSwapAmount(undefined)


                })
                .on('error', async function (error) {

                    setTradeState(undefined)
                    alert(error.message)
                })

        }


    }

    function _buttonTitle() {

        if (oneSelected()) return <div>Select a pair to swap</div>
        else if (bothSelected() && !swapAmount || Number(swapAmount) <= 0) return <div>Input amount to swap</div>
        else if (!tradeState && bothSelected() && currentSwap && !loading && !sameSelected() && Number(allowance) <= 0) return (
            <div>Unlock {selectedIn.reserve.symbol} to swap</div>
        )
        else if (!tradeState && bothSelected() && currentSwap && !loading && !sameSelected() && Number(allowance) > 0) return (
            <div>
                Swap {(currentSwap.amountIn / Math.pow(10, selectedIn.reserve.decimals)).toFixed(3)} a{selectedIn.reserve.symbol} for {(currentSwap.amountOut / Math.pow(10, selectedOut.decimals)).toFixed(3)} a{selectedOut.symbol}
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
        else if (tradeState === "approving") return <div>Approving {selectedIn.reserve.symbol}...</div>


    }

    function _buttonDisabled() {
        if (loading) return true
        if (oneSelected()) return true
        if (!currentSwap) return true
        if (tradeState !== undefined) return true
        if (!swapAmount || swapAmount === "") return true
        if (Number(swapAmount) <= 0) return true
        return false
    }


    return (

        <Row style={{ marginTop: 30 }}>

            <Col xl={3} lg={3} md={3} sm={12} xs={12}>

                <NextStyledInput
                    connectButton
                    buttonTitle={selectedIn && selectedOut ? "Max" : undefined}
                    buttonStyles={`
                        margin-left:-40px;
                        width:20px;
                        height:60px;
                        margin-right:0;
                    `}
                    buttonWidth={20}
                    buttonHoverStyle={`
                        text-decoration:none;
                    `}
                    onSubmit={() => setSwapAmount(Number(selectedIn.principalATokenBalance) / Math.pow(10, selectedIn.reserve.decimals))}
                    placeHolderText="Swap amount"
                    value={swapAmount}
                    disabled={!selectedIn || !selectedOut}
                    onChangeText={(text) => {

                        const currentBalance = Number(selectedIn.principalATokenBalance) / Math.pow(10, selectedIn.reserve.decimals)

                        console.log('text:', text)
                        console.log('principal balance:', currentBalance)

                        //Set maximum balance if exceeds
                        if (Number(text) > currentBalance) {
                            setSwapAmount((currentBalance - 0.0001).toFixed(4))
                        }
                        else {
                            setSwapAmount(text)
                        }


                    }}
                    inputFieldStyles={`
                    background:white;
                   padding-right:60px;
                  
                    height:60px;
                    font-size:16px;
                    width:100%;
               `}
                />

                {/*} <button style={{ background: 'none', color: themeBlack, padding: 0, margin: 0 }}>Max</button>
               {*/}
            </Col>

            <Col xl={9} lg={9} md={9} sm={12} xs={12}>


                <button disabled={_buttonDisabled()}
                    onClick={() => performSwap()}
                >

                    {_buttonTitle()}


                    <style jsx>
                        {`
                    button {
                        background:${themeBlack};
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