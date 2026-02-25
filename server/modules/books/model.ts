import { books } from "@/server/db/schema";

export type Book = typeof books.$inferSelect;
