<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
import { useAuthenticationStore } from '~/stores/authentication-store';

const store = useAuthenticationStore();

console.log(store.accessToken);

const accessToken = ref(store.accessToken);
const setAccessToken = (event: Event) => {
  store.setAccessToken(accessToken.value);
}
</script>

<template>
  <div>
    {{ accessToken }}
    <form @submit.prevent="setAccessToken">
      <input type="text" v-model="accessToken" />
      <button type="submit">Login</button>
    </form>
  </div>

</template>
