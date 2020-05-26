import React from "react";

interface HomepageButtonProps {
    url: string
    background: string
    title: string | JSX.Element
    subtitle: string
}

const HomepageButton = (props: HomepageButtonProps) => {

    const { url, background, title, subtitle } = props

    return (
        <button

            onClick={() => window.open(url)}
            style={{ background: background }}>

            {title}

            <div>{subtitle}</div>

            <style jsx>
                {`
                        button {
                            border-radius:16px;
                            display:flex;
                            flex-direction:column;
                            justify-content:center;
                            align-items:center;
                            width:100%;
                            height:180px;
                            margin-bottom:20px;
                          
                            transition:box-shadow 0.2s;
                            box-shadow:0px 0px 8px rgba(0, 0, 0, 0.3) 
                        }
    
                        button:hover {
                            box-shadow:0px 0px 16px rgba(0, 0, 0, 0.4);
                        }
    
                        button > p {
                            font-weight:bold;
                            font-size:32px;
                        }
    
                        button > div {
                            font-size:16px;
                            font-weight:300;
                            margin-left:30px;
                            margin-right:30px;
                        }
                `}
            </style>


        </button>
    );
}
export default HomepageButton;