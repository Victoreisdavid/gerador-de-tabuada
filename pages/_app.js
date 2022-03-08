import "../styles/global.css"

export default function App({ Component, pageProps }) {
    return (
        <>
            <div id="container">
                <Component {...pageProps} />
            </div>
        </>
    )
}