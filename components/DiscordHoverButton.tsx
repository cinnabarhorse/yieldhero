import React from "react";
import { DiscordSVG } from "../icons"

interface DiscordHoverButtonProps {

}

const DiscordHoverButton = (props: DiscordHoverButtonProps) => {
    return (

        <button onClick={() => {
            window.open("https://discord.gg/Hm9UFkb")
        }} className="hoverButton">
            {DiscordSVG(50, "blue", { filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))", })}



            <style jsx>
                {`
                .hoverButton {
                    width:50px;
                    height:50px;
                    background:none;
                    transition:transform 0.2s; 
                    background:none;
                    border:none;
                    padding:0;
                    position:fixed;
                    bottom:40px;
                    right:40px;
                   
                }

                .hoverButton:hover {
                    transform: scale(1.1);
                }

            `}
            </style>

        </button>



    );
}
export default DiscordHoverButton;