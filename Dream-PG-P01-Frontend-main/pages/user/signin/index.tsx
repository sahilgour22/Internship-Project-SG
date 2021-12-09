import { LockClosedIcon } from "@heroicons/react/solid";
import { SetStateAction, useState } from "react";
import { removeTokens } from "../../components/AuthLayout";
import Link from "next/link";
import Head from "next/head";
import { LoadingMD } from "../../components/UI/Loading";

export default function SingInPage() {
	const [data, setData] = useState({
		username: "",
		password: "",
		save: false,
	});
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState(false);

	return (
		<>
			<Head>
				<title>Sign In </title>
			</Head>

			<div className='flex items-center justify-center min-h-full px-4 py-12 my-10 sm:px-6 lg:px-8'>
				<div className='w-full max-w-md space-y-8'>
					<div>
						<img
							className='w-auto h-12 mx-auto'
							src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
							alt='Workflow'
						/>
						<h2 className='mt-6 text-3xl font-extrabold text-center text-gray-900'>
							Sign in to your account
						</h2>
					</div>
					<form
						className='mt-8 space-y-6'
						onSubmit={(e) => {
							e.preventDefault();
							SignIn(
								{
									username: data.username,
									password: data.password,
									save: data.save,
								},
								setLoading,
								setErr,
							);
						}}
					>
						<div className='flex-row -space-y-px rounded-md shadow-sm '>
							<div>
								<label htmlFor='email-address' className='sr-only'>
									Email address
								</label>
								<input
									type='email'
									autoComplete='email'
									required
									className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Email address'
									value={data["username"]}
									onChange={(e) => setData({ ...data, username: e.target.value })}
									disabled={loading}
								/>
							</div>
							<div>
								<label htmlFor='password' className='sr-only'>
									Password
								</label>
								<input
									type='password'
									autoComplete='current-password'
									required
									className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
									placeholder='Password'
									value={data["password"]}
									onChange={(e) => setData({ ...data, password: e.target.value })}
									disabled={loading}
								/>
							</div>

							{err && (
								<div className='pt-3 font-bold text-center text-red-500'>
									Email/ Password is incorrect
								</div>
							)}
						</div>

						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<input
									type='checkbox'
									value={data.save ? "on" : "off"}
									onChange={(e) => setData({ ...data, save: e.target.checked })}
									className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
									disabled={loading}
								/>
								<label
									htmlFor='remember-me'
									className='block ml-2 text-sm text-gray-900'
								>
									Remember me
								</label>
							</div>

							<div className='text-sm'>
								<a
									href='#'
									className='font-medium text-indigo-600 hover:text-indigo-500'
								>
									Forgot your password?
								</a>
							</div>
						</div>

						<div>
							<button
								type='submit'
								className={
									"relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" +
									(loading && " cursor-wait ")
								}
								disabled={loading}
							>
								{loading ? (
									<LoadingMD />
								) : (
									<>
										<span className='absolute inset-y-0 left-0 flex items-center pl-3'>
											<LockClosedIcon
												className='w-5 h-5 text-indigo-500 group-hover:text-indigo-400'
												aria-hidden='true'
											/>
										</span>
										Sign in
									</>
								)}
							</button>
						</div>

						<div className='space-y-4'>
							<div className='flex text-sm'>
								<hr className='w-2/6 my-auto border-gray-300' />
								<h3 className='w-4/6 text-center'>Want an Account?</h3>
								<hr className='w-2/6 my-auto border-gray-300' />
							</div>
							<Link href='/user/signup' passHref>
								<div className='relative flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md cursor-pointer group hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
									Create an account
								</div>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

const SignIn = (
	data: { username?: string; password?: string; save: any },
	setLoading: { (value: SetStateAction<boolean>): void },
	setErr: { (value: SetStateAction<boolean>): void },
) => {
	setLoading(true);

	// Sending the sign in request to the server
	fetch(`${process.env.BACKEND_SERVER}/api/user/login/`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: JSON.stringify(data),
		credentials: "include",
	})
		.then((res) => res.json())
		.then((d) => {
			removeTokens();
			if (d.detail) {
				setLoading(false);
				setErr(true);
				return;
			}

			// If the user is authenticated successfully
			if (data.save) {
				localStorage.setItem("token", d.refresh);
			} else {
				sessionStorage.setItem("token", d.refresh);
			}

			window.location.href = "/";
		})
		.catch((e) => {
			setLoading(false);
			console.log(e);
		});
};

export { SignIn };
