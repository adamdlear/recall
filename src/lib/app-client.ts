import { App } from "@/server";
import { treaty } from "@elysiajs/eden";

export const app = treaty<App>("localhost:3000")
