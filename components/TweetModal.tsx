import React from "react";
import { Modal } from "react-bootstrap";
import { useStateValue } from "../State/globalState";
import ShareIcon from "./ShareIcon";

import { twitterLogoBlue, twitterDarkBlue } from '../theme'
import { UserReserveType, CreatorType } from "../types";

interface TweetModalProps {

}

const TweetModal = (props: TweetModalProps) => {

    const [{

        selectedCreator,
        selectedToken,
        showTweetModal
    }, dispatch]: [{
        globalWeb3: any,
        currentAccount: string,
        selectedCreator: CreatorType,
        selectedToken: UserReserveType,
        showTweetModal: boolean
    }, (type) => void] = useStateValue()


    return (
        <Modal
            show={showTweetModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => {
                dispatch({
                    type: "updateShowTweetmodal",
                    showTweetModal: false
                })

                dispatch({
                    type: "updateSelectedCreator",
                    selectedCreator: undefined
                })

                dispatch({
                    type: 'updatedSelectedToken',
                    selectedToken: undefined
                })
            }
            }
        >



            <Modal.Header closeButton onClick={() => {
                dispatch({
                    type: "updateShowTweetModal",
                    showTweetModal: false
                })

                dispatch({
                    type: "updateSelectedCreator",
                    selectedCreator: undefined
                })

                dispatch({
                    type: 'updatedSelectedToken',
                    selectedToken: undefined
                })


            }
            }>
                <Modal.Title style={{ width: '100%' }} id="contained-modal-title-vcenter">
                    <h1>
                        You rock! ✌️
                        </h1>
                </Modal.Title>

            </Modal.Header>

            <Modal.Body style={{ marginBottom: 15 }}>

                <p>
                    Your redirect is on the way!
                    </p>

                <div className="meantime">

                    In the meantime, why not tweet and tell the world how generous you are?
                   </div>





                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="tweetIt">Tweet it! 👉</div>

                    <ShareIcon
                        type="twitter"
                        currentURL="https://yieldhero.app"
                        message={`Hey world, look how generous I am! I just redirected my @AaveAave $a${selectedToken && selectedToken.reserve.symbol} yield to support ${selectedCreator && selectedCreator.name} ${selectedCreator && selectedCreator.twitter}! Via`}
                        //icon={faTwitter*}
                        icon=""
                        iconColor="white"
                        iconBackgroundColor={twitterLogoBlue}
                        iconHoverStyles={`
            background:${twitterDarkBlue};
        `}
                        link={`https://yieldhero.app/redirect`}


                        borderRadius={25}

                    />
                </div>



            </Modal.Body>

            <style jsx>
                {`
                    h1 {
                        text-align:center;
                        width:100%;
                        text-decoration:none;
                        font-size:32px;
                        font-weight:bold;
                        margin:0;
                        padding:0;
                    }

                    .tweetIt {
                        font-size:16px;
                        margin-right:8px;
                        font-weight:800;
                    }

                    p {
                        text-align:center;
                        padding-left:30px;
                        padding-right:30px;
                        margin:15px;
                        margin-top:5px;
                        font-size:24px;
                    }

                    .meantime {
                        text-align:center;
                        padding-left:30px;
                        padding-right:30px;
                        margin:15px;
                        font-size:18px;
                        margin-bottom:30px;
                    }
                `}
            </style>

        </Modal >
    );
}
export default TweetModal;