import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Deterministically derive a background color from a book title.
 *  Uses a djb2 hash → HSL with fixed saturation/lightness so
 *  white text is always readable.
 */
export function bookColor(title: string): string {
	let hash = 5381;
	for (let i = 0; i < title.length; i++) {
		hash = (hash * 33) ^ title.charCodeAt(i);
		hash = hash >>> 0; // keep as unsigned 32-bit
	}
	const hue = hash % 360;
	return `hsl(${hue}, 55%, 38%)`;
}
