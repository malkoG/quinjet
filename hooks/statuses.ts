import { ACCESS_TOKEN } from "~/constants/tokens";
import type { Status } from "~/models/status";


export const useStatus = (url: string) => {
	const data: Promise<Status> = $fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${ACCESS_TOKEN}`
		}
	})

	return data;
}
