import React from "react";
import { Col } from "react-bootstrap";
import { donateGradient } from "../theme";

interface BoxProps {
    children: any
    title: string | JSX.Element
    buttonRight?: string
    buttonRightAction?: () => void
    background: string
}


const Box = (props: BoxProps) => {

    const { title } = props

    return (
        <Col
            style={{ background: 'ghostwhite', borderRadius: '2px', overflow: 'hidden', boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0 }}>



            <h2 style={{ textAlign: 'center', background: donateGradient, color: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>{title}</h2>

            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>

                {props.children}

            </div>

            <style>
                {`
                    h2 {
                        text-transform:uppercase;
                        letter-spacing:1.2px;
                    }
                `}
            </style>
        </Col>

    );
}
export default Box;