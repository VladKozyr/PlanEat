import React, {useEffect} from "react";
import {Provider} from 'react-redux'
import {useStore} from '../store'
import {applyMiddleware, compose} from "redux";
import thunk from "redux-thunk"
import '../styles/less/antd-custom.less'
import Head from "next/head"

export default function App({Component, pageProps}) {

    const store = useStore(pageProps.initialReduxState, compose(applyMiddleware(thunk)));

    return (
        <Provider store={store}>
            <Head>
                <script dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TBT282Q');`
                }}/>
                <link
                    rel='preload'
                    href='../public/fonts/Montserrat/Montserrat-Medium.ttf'
                    as='font'
                    crossOrigin=''
                />
            </Head>
            <body>
            <noscript dangerouslySetInnerHTML={{
                __html: <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TBT282Q"
                                height="0" width="0" style="display:none;visibility:hidden"/>
            }}/>
            <Component {...pageProps} />
            </body>
        </Provider>
    )
}
