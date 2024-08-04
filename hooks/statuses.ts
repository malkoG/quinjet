import { createRestAPIClient } from "masto";
import { createPinia } from "pinia";


export const useStatus = async (statusId: string) => {
  const pinia = createPinia();
  const store = useAuthenticationStore(pinia)
  const masto = createRestAPIClient({
    url: "https://pixelfed.social",
    accessToken: store.accessToken,
  });
  const data = await masto.v1.statuses.$select(statusId);
  const result = data.fetch();

  return result;
};
