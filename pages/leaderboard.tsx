import React from "react";
import YieldLeaderboard from "../components/interest/YieldLeaderboard";
import { withApollo } from "../lib/apollo";
import Box from "../components/Box";
import { donateGradient } from "../theme";

interface LeaderboardProps {

}

const Leaderboard = (props: LeaderboardProps) => {
    return (
        <Box
            background={donateGradient}
            title="Yield Hero Leaderboard"
        >
            <YieldLeaderboard />
        </Box>
    );
}
export default withApollo({ ssr: true })(Leaderboard)