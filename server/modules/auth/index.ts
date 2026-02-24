import type { Context } from "elysia";
import { Elysia } from "elysia";
import { auth } from "../../lib/auth";

const betterAuthView = async (context: Context) => {
	const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
	// validate request method
	if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
		const response = await auth.handler(context.request);
		console.log("BETTER-AUTH REQUEST", context.request)
		console.log("BETTER-AUTH REPONSE", response)
		return response
	} else {
		context.error(405);
	}
};

const authService = new Elysia()
	.get("/api/auth/*", betterAuthView)
	.post("/api/auth/*", betterAuthView)

export { authService as auth };
