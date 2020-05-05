import React from 'react'
import App from 'next/app'
import Head from 'next/head'

import { GlobalState } from '../State/globalState'
import { initialState } from '../State/initialState'
import { reducer } from '../State/reducers'




class MyApp extends App {



    render() {
        const { Component, pageProps } = this.props

        console.log('CURRENT ENVIRONMENT:', process.env.ENVIRONMENT)

        return (

            <div>
                <Head>
                    <link
                        rel="stylesheet"
                        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                        crossOrigin="anonymous"
                    />

                </Head>


                <GlobalState initialState={initialState} reducer={reducer}>
                    <Component {...pageProps} />
                </GlobalState>
            </div>



        )
    }
}

export default MyApp