import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { USER_RESERVES_INTEREST, USERS_BY_REDIRECT_BALANCE } from "../../graphql/queries";
import { useStateValue } from "../../State/globalState";
import { UserReserveType, User } from "../../types";
import { Col } from "react-bootstrap";
import { donateGradient } from "../../theme";
import ErrorMessage from "../ErrorMessage";
import { smartTrim } from "../../functions";
import ATokenABI from '../../web3/ATokenABI.json'



export default function UsersByRedirectBalance() {

    const unusedAddresses = ["0x5ae7e199ec6acfe1d7ee28401637a0ae897818c1"]


    const [{ currentAccount, globalWeb3 }, dispatch]:
        [{ globalWeb3: any, currentAccount: any, }, (type) => void] = useStateValue()

    const [resolvedAddresses, setResolvedAddresses] = useState(undefined)

    const { loading, error, data, refetch } = useQuery(
        USERS_BY_REDIRECT_BALANCE,
        {
            variables: {
                id: currentAccount ? currentAccount.toLowerCase() : undefined
            },
            //pollInterval: 5000
        }
    )

    console.log('error:', error, data)

    async function setRedirectAddress(reserve: UserReserveType) {

        const ERC20 = new globalWeb3.eth.Contract(ATokenABI, reserve.reserve.aToken.id)

        ERC20.methods.redirectInterestStream("0x94cb5C277FCC64C274Bd30847f0821077B231022").send({
            from: currentAccount
        })

        console.log('erc30:', ERC20)


    }

    useEffect(() => {


        if (!data || data === null) return;
        if (!globalWeb3) return;
        retrieveResolveAddresses()

    }, [globalWeb3, data])

    async function retrieveResolveAddresses() {
        var ENS = require('ethereum-ens');
        var ens = new ENS(globalWeb3);

        var resolved = ["0xC3c2e1Cf099Bc6e1fA94ce358562BCbD5cc59FE5"]

        data.userReserves.forEach((reserve) => {

            if (unusedAddresses.includes(reserve.interestRedirectionAddress)) return;
            if (!resolved.includes(reserve.user.id)) {
                console.log('reserve:', reserve)
                resolved.push(reserve.user.id)
            }
            if (!resolved.includes(reserve.interestRedirectionAddress)) {
                resolved.push(reserve.interestRedirectionAddress)
            }
        });

        var finalResolved = await Promise.all((resolved.map(async (id) => {
            const name = await resolveAddress(ens, id)

            console.log('name:', name)

            if (!name || name === null) return undefined
            return {
                id: id,
                name: name
            }
        })));

        console.log('final resolved:', finalResolved)

        const finalArray = finalResolved.filter((obj) => {
            return obj !== undefined
        })

        console.log('final array:', finalArray)

        setResolvedAddresses(finalArray)
    }

    async function resolveAddress(ens, address) {


        try {
            var name = await ens.reverse(address).name()

            // console.log('name:', name)
            // Check to be sure the reverse record is correct.
            // if (address != await ens.resolver(name).addr()) {
            //     name = null;
            // }

            // console.log('name:', name)

            return name

        } catch (error) {
            return undefined
        }


    }

    function _ensName(address: string) {

        if (!resolvedAddresses) return smartTrim(address, 15)

        const name = resolvedAddresses.find((obj) => {
            return obj.id === address
        })

        if (name) return name.name
        else return smartTrim(address, 15)
    }

    function _box() {


        return (
            <Col //xl={6} lg={6} md={12} sm={12} xs={12}
                style={{ boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0, minHeight: 300, marginTop: 40 }}>


                <h2 style={{ textAlign: 'center', background: donateGradient, color: 'white' }}> Top Interest Redirects</h2>

                <div style={{ display: 'block', padding: 10 }}>

                    <div style={{ display: 'flex' }}>

                        <Col>
                            <strong>
                                Sender
                </strong>
                        </Col>


                        <Col>
                            <strong>
                                Redirect Amt.
                </strong>
                        </Col>


                        <Col>
                            <strong>Recipient</strong></Col>

                    </div>

                    {data && data.userReserves !== null && data.userReserves.map((user: UserReserveType, index) => {


                        const principalBalance = Number(Number(user.principalATokenBalance) / Math.pow(10, user.reserve.decimals))

                        const amount = Number((principalBalance * Number(Number(user.reserve.price.priceInEth) / Math.pow(10, 18)))) / Math.pow(10, user.reserve.decimals)

                        if (user.interestRedirectionAddress === "0x5ae7e199ec6acfe1d7ee28401637a0ae897818c1") return null;

                        return (

                            <div className="divBG">


                                <Col>
                                    <div style={{ textAlign: 'left' }}>{_ensName(user.user.id)}</div>
                                </Col>


                                <Col>
                                    <div>{Number(amount) > 1 ? amount.toFixed(3) : "< 1"} ETH
                                    </div>
                                </Col>

                                <Col>
                                    <div>{_ensName(user.interestRedirectionAddress)}</div>
                                </Col>

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


