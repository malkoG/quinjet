import { createRestAPIClient } from "masto";

const masto = createRestAPIClient({
	url: "https://pixelfed.social",
	accessToken: process.env.ACCESS_TOKEN,
})

export const useStatus = async (statusId: string) => {
	const data = await masto.v1.statuses.$select(statusId);
	const result = data.fetch();
	
	return result
}
