import React, { useEffect, useState } from "react";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, ReserveType, TradeState, CreatorType } from "../../types";
import { Row, Col } from "react-bootstrap";
import { buttonInactive, themeBlack, donateGradient } from "../../theme";

import NextStyledInput from "../NextStyledInput";
import ATokenABI from '../../web3/ATokenABI.json'
import { smartTrim } from "../../functions";


interface SwapButtonProps {

}

const RedirectButton = (props: SwapButtonProps) => {

    const [{
        globalWeb3,
        currentAccount,
        selectedCreator,
        selectedToken
    }, dispatch]: [{
        globalWeb3: any,
        currentAccount: string,
        selectedCreator: CreatorType,
        selectedToken: UserReserveType
    }, (type) => void] = useStateValue()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(undefined)

    const [swapAmount, setSwapAmount] = useState(undefined)
    const [tradeState, setTradeState] = useState<TradeState>(undefined)

    const [allowance, setAllowance] = useState(undefined)



    function bothSelected() {
        return selectedCreator && selectedToken
    }

    function oneSelected() {
        return (selectedCreator && !selectedToken) || (selectedToken && !selectedCreator) || (!selectedCreator && !selectedToken)
    }

    useEffect(() => {

        setLoading(true)

        if (bothSelected() && swapAmount && swapAmount !== "" && swapAmount !== "0") {
            setError(undefined)
        }
        else setLoading(false)


    }, [selectedToken, selectedCreator, swapAmount])


    useEffect(() => {

        if (selectedToken) {
            fetchAllowance()
        }


    }, [selectedToken])

    async function fetchAllowance() {

        const poolAddress = process.env.POOL_ADDRESS

        //First check if this token is approved
        const ERC20 = new globalWeb3.eth.Contract(ATokenABI, selectedToken.reserve.aToken.id)

        const allowance = await ERC20.methods.allowance(currentAccount, poolAddress).call({ from: currentAccount })

        setAllowance(allowance)
    }

    async function performRedirect() {

        //Check if wallet is valid
        try {
            globalWeb3.utils.toChecksumAddress(selectedCreator.wallet)

            setLoading(true)
            setTradeState("waitingConfirm")

            const ERC20 = new globalWeb3.eth.Contract(ATokenABI, selectedToken.reserve.aToken.id)

            ERC20.methods.redirectInterestStream(selectedCreator.wallet)
                .send({
                    from: currentAccount
                })

                .on('transactionHash', async function (newHash) {

                    setTradeState("trading")

                })

                .on('receipt', async function (receipt) {

                    alert("Redirect complete!")

                    setTradeState(undefined)

                    dispatch({
                        type: "updateSelectedCreator",
                        selectedCreator: undefined
                    })

                    dispatch({
                        type: 'updatedSelectedToken',
                        selectedToken: undefined
                    })

                    setLoading(false)

                })
                .on('error', async function (error) {

                    setLoading(false)
                    setTradeState(undefined)
                    alert(error.message)
                })

        } catch (e) {
            alert(e.message)
            console.error('error', e.message)
        }

    }

    function _buttonTitle() {

        if (oneSelected()) return <div>Select redirect recipient</div>
        else if (!tradeState && bothSelected() && !loading) return (
            <div>
                Redirect yield of {(Number(selectedToken.principalATokenBalance) / Math.pow(10, selectedToken.reserve.decimals)).toFixed(2)} a{selectedToken.reserve.symbol} to {selectedCreator.name} ({selectedCreator.ens ? selectedCreator.ens : smartTrim(selectedCreator.wallet, 15)})
            </div>
        )
        else if (bothSelected() && error) return <div> {error} </div>
        else if (tradeState === "waitingConfirm") return (
            <div>Waiting to approve...</div>
        )
        else if (tradeState === "trading") return (
            <div>Redirecting...</div>
        )


    }

    function _buttonDisabled() {
        if (loading) return true
        if (oneSelected()) return true
        return false
    }

    if (!bothSelected()) return null;
    if (typeof window !== undefined && window.location.pathname !== "/redirect") return null;

    return (

        <button disabled={_buttonDisabled()}
            onClick={() => performRedirect()}
        >

            {_buttonTitle()}


            <style jsx>
                {`
                    button {
                     
                        background:${donateGradient};
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        width:100%;
                        margin:0 auto;

                        height:70px;
                      
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



    );
}
export default RedirectButton;