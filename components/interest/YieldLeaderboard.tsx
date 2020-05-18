import React, { useEffect, useState } from "react";
import { USERS_BY_REDIRECT_BALANCE } from "../../graphql/queries";
import { useQuery } from "@apollo/react-hooks";
import { UserReserveType, LeaderboardUser } from "../../types";
import LeaderboardItem from "./LeaderboardItem";

interface YieldLeaderboardProps {

}

const YieldLeaderboard = (props: YieldLeaderboardProps) => {

    const [sorted, setSorted] = useState(undefined)
    const [sortedKeys, setSortedKeys] = useState(undefined)
    const [sortedByAmount, setSortedByAmount] = useState(undefined)


    const { loading, error, data, refetch } = useQuery(
        USERS_BY_REDIRECT_BALANCE,
        {
            //pollInterval: process.env.NETWORK === "kovan" ? 0 : 10000,
            fetchPolicy: 'network-only',
            notifyOnNetworkStatusChange: true
        }
    )


    useEffect(() => {

        if (!data) return;

        var userKeys = []
        var sortedUsers = []

        var userAmounts = []

        data.userReserves.forEach((obj: UserReserveType) => {

            const address = obj.user.id

            if (!userKeys.includes(address)) userKeys.push(address)
            if (!sortedUsers[address]) sortedUsers[address] = []
            sortedUsers[address].push(obj)
        });

        userKeys.forEach((address: string) => {
            const user = sortedUsers[address]
            let finalYield = 0

            user.forEach((userReserve: UserReserveType) => {

                let yieldEth = Number(userReserve.reserve.price.priceInEth) / Math.pow(10, 18)
                let quantity = Number(userReserve.principalATokenBalance) / Math.pow(10, userReserve.reserve.decimals)


                let totalYield = quantity * yieldEth
                finalYield = finalYield + totalYield

                console.log('quantity:', quantity)
                console.log('yield eth:', yieldEth)

            });

            userAmounts.push({
                address: address,
                amount: finalYield,
                user: user
            })

        });


        setSortedKeys(userKeys)
        setSorted(sortedUsers)

        //Finally, sort by amount

        const sorted = userAmounts.sort(function (a, b) { return b.amount - a.amount });

        console.log('sorted:', sorted)
        setSortedByAmount(sorted)


    }, [data])


    return (
        <div>

            <h3>Who's contributing the most to open-source Web3 development?
               </h3>


            {(loading || (!loading && data && !sorted && !sortedByAmount)) &&
                <div style={{ height: 150, margin: 10 }}>Loading...</div>
            }


            {data && sortedByAmount && sortedByAmount.map((user: LeaderboardUser, index) => {

                if (!user) return null
                return <LeaderboardItem user={user} index={index} />
            })}

            <style jsx>
                {`
                    h3 {
                        margin:15px;
                        margin-bottom:25px;
                        font-size:18px;
                        font-weight:300;
                        text-align:center;
                    }
                `}
            </style>

        </div>
    );
}
export default YieldLeaderboard;