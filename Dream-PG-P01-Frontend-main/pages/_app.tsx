import "../styles/global.css";
import type { AppProps } from "next/app";
import AuthLayout from "./components/AuthLayout";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Imposter</title>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			</Head>
			<AuthLayout>
				<Component {...pageProps} />
			</AuthLayout>
		</>
	);
}

export default MyApp;
