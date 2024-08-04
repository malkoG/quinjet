import { createRestAPIClient } from "masto";

export const useStatus = async (statusId: string) => {
  const store = useAuthenticationStore()
  const masto = createRestAPIClient({
    url: "https://pixelfed.social",
    accessToken: store.accessToken,
  });
  const data = await masto.v1.statuses.$select(statusId);
  const result = data.fetch();

  return result;
};
