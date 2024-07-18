import { createRestAPIClient } from "masto";
import { ACCESS_TOKEN } from "~/constants/tokens";
import type { Status } from "~/models/status";


const masto = createRestAPIClient({
	url: "https://pixelfed.social",
	accessToken: ACCESS_TOKEN,
})

export const useStatus = async (statusId: string) => {
	const data = await masto.v1.statuses.$select(statusId);
	const result = data.fetch();
	
	return result
}
