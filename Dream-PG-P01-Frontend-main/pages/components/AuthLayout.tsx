import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import Loading from "./UI/Loading";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout: React.FunctionComponent<AuthLayoutProps> = ({ children }): JSX.Element => {
	const [show, setShow] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// This will verify if the user is authenticated or not
		if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
			const token = localStorage.getItem("token") || sessionStorage.getItem("token");

			// This will verify if the token is valid or not
			fetch(`${process.env.BACKEND_SERVER}/api/user/verify/`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json; charset=UTF-8",
				},
				credentials: "include",
				body: JSON.stringify({ token: token }),
			})
				.then((res) => res.json())
				.then((d) => {
					if (Object.keys(d).length !== 0 && d.constructor === Object) {
						setShow(false);
						removeTokens();
						router.push("/user/signin");
					} else {
						// If the user is authenticated, then redirect to the home page
						if (
							!router.pathname.includes("/user/signin") &&
							!router.pathname.includes("/user/signup")
						) {
							router.push("/");
						}
					}
				});
		} else {
			// If the user is not authenticated, then redirected to the signin page
			if (
				!router.pathname.includes("/user/signin") &&
				!router.pathname.includes("/user/signup")
			) {
				router.push("/user/signin");
			}
		}
	}, []);

	return <>{!show ? <Loading /> : children}</>;
};

export function removeTokens() {
	localStorage.removeItem("token");
	sessionStorage.removeItem("token");
}

export default AuthLayout;
