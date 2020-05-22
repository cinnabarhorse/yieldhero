import React from "react";
import { TwitterSVG } from "../icons"
import { FacebookSVG } from '../icons'
import { themeBlack } from "../theme";

type SocialIconType = "like" | "twitter" | "facebook"


interface ShareIconProps {
    type: SocialIconType
    link: string
    message: string //message to share
    currentURL: string //required for the link
    displayID?: string
    icon: any
    iconColor: string
    iconBackgroundColor?: string
    iconHoverStyles?: string
    borderRadius?: number
    number?: number
    onClick?: () => void

}

const ShareIcon = (props: ShareIconProps) => {

    const { type, icon, link, displayID, message, currentURL, iconBackgroundColor, iconHoverStyles, borderRadius, number, onClick } = props

    return (
        <div >

            <style jsx>
                {`
    

    .listPageShareIcon {
        display:flex;
        justify-content:center;
        background:none;
        height:50px;
        min-width:50px;
        width:50px;
        border-radius:${borderRadius ? borderRadius : 0}px;
        background:${iconBackgroundColor ? iconBackgroundColor : "white"};
        transition:background 0.2s;
        border:none;
    }

    .listPageShareIcon:hover {
        ${iconHoverStyles && iconHoverStyles};
    }

    .listPageShareIconNumber {
        font-size:11pt;
        color:${themeBlack};
        margin-top:2px;
        margin-left:6px;
    }

    `}
            </style>



            {type === "like" &&
                <button onClick={() => onClick()} className="listPageShareIcon" style={{ width: 'auto' }}>
                    <span>
                        {icon}
                    </span>


                    {number &&
                        <span className="listPageShareIconNumber">{number}</span>
                    }


                </button>
            }

            {type === "twitter" &&

                <button className="listPageShareIcon"
                    onClick={() => { window.open(`https://twitter.com/intent/tweet?url=${link}&text=${message}`, 'popup', 'width=600,height=600'); return false; }}>


                    <div style={{ display: 'flex', width: 20, height: 20 }}>
                        {TwitterSVG(25, "white")}
                    </div>




                </button>



            }

            {type === "facebook" &&


                <button className="listPageShareIcon">

                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentURL}/${displayID}/${link}`}
                        target="popup"
                        onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentURL}/${displayID}/${link}`, 'popup', 'width=600,height=600'); return false; }}>
                        <div style={{ width: 20, height: 20 }}>
                            {FacebookSVG(20, "black")}
                        </div>

                    </a>


                </button>



            }





        </div>

    );
}
export default ShareIcon;