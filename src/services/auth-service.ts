import type { Context } from "elysia";
import { Elysia } from "elysia";
import { auth } from "../lib/auth";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.error(405)
  }
}

const authService = new Elysia().all("/api/auth/*", betterAuthView);

export { authService };
