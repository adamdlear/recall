import type { App } from "@/server";
import { treaty } from "@elysiajs/eden";

const host =
	typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export const app = treaty<App>(host);
