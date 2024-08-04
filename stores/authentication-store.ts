import { defineStore } from "pinia";
import { useSessionStorage } from "@vueuse/core";


export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    accessToken: sessionStorage.getItem("accessToken") || "",
  }),
  getters: {
    isAuthenticated: (state) => {
      return state.accessToken.length !== 0
    }
  },
  actions: {
    setAccessToken(token: string) {
      sessionStorage.setItem("accessToken", token);
    },
    clearAccessToken() {
      this.accessToken = '';
    },
  },
});
