import { LockClosedIcon } from "@heroicons/react/solid";
import { FC, useState } from "react";
import Link from "next/link";
import { SignIn } from "../signin";
import { LoadingMD } from "../../components/UI/Loading";
import Head from "next/head";

export default function SignUpPage(): JSX.Element {
	const [data, setData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		password_confirmation: "",
	});
	const [emailErr, setEmailErr] = useState(false);
	const [loading, setLoading] = useState(false);
	const [Signing, setSigning] = useState(false);

	const SignUp = () => {
		setLoading(true);
		setEmailErr(false);

		// Signing up
		fetch(`${process.env.BACKEND_SERVER}/api/user/new/`, {
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
				if (d.error) {
					setEmailErr(true);
				}

				if (d.success) {
					setSigning(true);

					// If the user is created successfully, it logged in and redirect to the Home page.
					SignIn(
						{
							username: data.email,
							password: data.password,
							save: true,
						},
						setLoading,
						setEmailErr,
					);
				}

				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<>
			<Head>
				<title>Sign Up </title>
			</Head>

			<div className='flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8'>
				<div className='w-full max-w-md space-y-8'>
					<div>
						<img
							className='w-auto h-12 mx-auto'
							src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
							alt='Workflow'
						/>
						<h2 className='mt-6 text-3xl font-extrabold text-center text-gray-900'>
							Create a new account
						</h2>
					</div>
					<form
						className='mt-8 space-y-4'
						onSubmit={(e) => {
							e.preventDefault();
							SignUp();
						}}
					>
						<div className='mb-4 space-y-4 rounded-md'>
							<div className='grid grid-flow-col space-x-4'>
								<InputField
									label='First Name'
									value={data.first_name}
									onChange={(e: string) => setData({ ...data, first_name: e })}
									type='text'
									placeholder=''
								/>
								<InputField
									label='Last Name'
									value={data.last_name}
									onChange={(e: string) => setData({ ...data, last_name: e })}
									type='text'
									placeholder=''
								/>
							</div>

							<div className='space-y-2'>
								<InputField
									label='Email'
									appendClassName={
										emailErr &&
										"text-sm font-bold text-red-500 border-red-500 focus:border-red-500 focus:ring-red-500 "
									}
									value={data.email}
									onChange={(e: string) => {
										setData({ ...data, email: e });
										setEmailErr(false);
									}}
									type='email'
									placeholder=''
								/>
								{emailErr && (
									<div className='text-sm font-bold text-red-500'>
										This email is already taken.
									</div>
								)}
							</div>

							<InputField
								label='Password'
								value={data.password}
								onChange={(e: string) => setData({ ...data, password: e })}
								type='password'
								placeholder=''
							/>

							<div className='space-y-2'>
								<InputField
									label='Confirm Password'
									appendClassName={
										data.password.length != 0 &&
										data.password_confirmation.length != 0 &&
										data.password !== data.password_confirmation &&
										"text-sm font-bold text-red-500 border-red-500 focus:border-red-500 focus:ring-red-500 "
									}
									value={data.password_confirmation}
									onChange={(e: string) =>
										setData({ ...data, password_confirmation: e })
									}
									type='password'
									placeholder=''
								/>
								{data.password.length != 0 &&
									data.password_confirmation.length != 0 &&
									data.password !== data.password_confirmation && (
										<div className='text-sm font-bold text-red-500'>
											Passwords do not match
										</div>
									)}
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
										{Signing ? (
											"Signing In ..."
										) : (
											<>
												<span className='absolute inset-y-0 left-0 flex items-center pl-3'>
													<LockClosedIcon
														className='w-5 h-5 text-indigo-500 group-hover:text-indigo-400'
														aria-hidden='true'
													/>
												</span>
												Create account
											</>
										)}
									</>
								)}
							</button>
						</div>

						<div className='space-y-4'>
							<div className='flex text-sm'>
								<hr className='w-2/6 my-auto border-gray-300' />
								<h3 className='w-4/6 text-center'>Already a User?</h3>
								<hr className='w-2/6 my-auto border-gray-300' />
							</div>
							<Link href='/user/signin' passHref>
								<div className='relative flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md cursor-pointer group hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
									Sign In
								</div>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}

const InputField: FC<any> = ({
	label,
	type,
	value,
	onChange,
	placeholder,
	appendClassName,
	loading = false,
}): JSX.Element => {
	return (
		<div>
			<label htmlFor='price' className='block text-sm font-medium text-gray-700'>
				{label}
			</label>
			<div className='relative mt-1 rounded-md shadow-sm'>
				<input
					type={type}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className={
						(loading ? "pr-9 " : "pr-3 ") +
						"relative block w-full pl-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:ring-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm " +
						appendClassName
					}
					placeholder={placeholder}
					disabled={loading}
					required
				/>
				{loading && (
					<div className='absolute inset-y-0 z-50 flex right-1'>
						<div className='my-auto'>
							<LoadingMD />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
