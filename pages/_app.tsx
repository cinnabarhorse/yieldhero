import React from 'react'
import App from 'next/app'
import Head from 'next/head'

import { GlobalState } from '../State/globalState'
import { initialState } from '../State/initialState'
import { reducer } from '../State/reducers'
import Header from '../components/Header'
import Layout from '../components/Layout'
import AuthModal from '../components/AuthModal'
import NextReusableHead from '../components/NextReusableHead'
import RedirectButton from '../components/interest/RedirectButton'
import '../fonts.css'




class MyApp extends App {

    render() {
        const { Component, pageProps } = this.props

        console.log('CURRENT ENVIRONMENT:', process.env.ENVIRONMENT)

        return (

            <div>

                <GlobalState initialState={initialState} reducer={reducer}>

                    <Layout>
                        <Head>
                            <link
                                rel="stylesheet"
                                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                                integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                                crossOrigin="anonymous"
                            />

                        </Head>


                        <NextReusableHead
                            title="Yield Hero - One-stop tool suite for Aave #yieldhacking"
                            description="Your one-stop tool suite for Aave #yieldhacking"
                            siteName="YieldHero"
                            url="https://yieldhero.app"
                            image="/yieldhack.jpg"
                            faviconPath="/favicon.ico"

                        />





                        <Header
                            title="Yield Hero"
                            desc="Your one-stop tool suite for Aave #yieldhacking" />



                        <AuthModal />


                        <Component {...pageProps} />

                    </Layout>


                    <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                        <RedirectButton />
                    </div>



                </GlobalState>

            </div>


        )
    }
}

export default MyApp