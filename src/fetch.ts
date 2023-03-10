import _fetch from "node-fetch";

declare global {
	const fetch: typeof _fetch;
}
