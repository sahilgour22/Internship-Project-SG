/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	env: {
		BACKEND_SERVER: process.env.BACKEND_SERVER,
	},
};
