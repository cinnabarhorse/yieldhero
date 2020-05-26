import React from "react";
import Link from "next/link";
import Router from 'next/router'
import { useStateValue } from "../State/globalState";
import { swapGradient } from "../theme";

interface HomepageLinkProps {
    href: string
    background: string
    title: string | JSX.Element
    subtitle: string
    newHeader: string
    icon: JSX.Element | string

}

const HomepageLink = (props: HomepageLinkProps) => {

    const [{ }, dispatch] = useStateValue()

    const { href, background, icon, newHeader, title, subtitle } = props
    return (
        <Link href={href}>
            <button onClick={() => {


                Router.push(href).then(() => {

                    window.scrollTo(0, 0)

                    dispatch({
                        type: 'updateCurrentHeader',
                        currentHeader: newHeader
                    })
                })

            }} style={{ background: background }}>


                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    {icon && <div style={{ marginRight: 8 }}>{icon}</div>}
                    <p>     {title} </p>

                </div>





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
                            background:${swapGradient};
                            transition:box-shadow 0.2s;
                            box-shadow:0px 0px 8px rgba(0, 0, 0, 0.3) 
                        }
    
                        button:hover {
                            box-shadow:0px 0px 16px rgba(0, 0, 0, 0.4);
                        }

                        button > div > div > div {
                            font-weight:bold;
                            font-size:32px;
                        }
    
                        button > div > p {
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


        </Link>
    );
}
export default HomepageLink;