<script setup lang="ts">
import { createRestAPIClient } from 'masto';
import { useQuery } from "@tanstack/vue-query";

const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

/*
profile: Object { id: "727795364395070263", username: "kojima.dev", acct: "kojima.dev", … }
​​
acct: "kojima.dev"
​​
avatar: "https://pixelfed.social/storage/avatars/default.jpg"
​​
avatarStatic: "https://pixelfed.social/storage/avatars/default.jpg"
​​
bot: false
​​
createdAt: "2024-08-10T07:58:56.000000Z"
​​
discoverable: true
​​
displayName: "Kojima's DevJournal"
​​
emojis: Array []
​​
fields: Array []
​​
followersCount: 2
​​
followingCount: 2
​​
header: "https://pixelfed.social/storage/headers/missing.png"
​​
headerStatic: "https://pixelfed.social/storage/headers/missing.png"
​​
id: "727795364395070263"
​​
lastStatusAt: null
​​
locked: false
​​
note: ""
​​
source: Object { privacy: "public", sensitive: false, language: "en", … }
​​
statusesCount: 2
​​
url: "https://pixelfed.social/kojima.dev"
​​
username: "kojima.dev"
*/

const { isPending, isError, data, error } = useQuery({
  queryKey: ['profile'],
  queryFn: async () => {
    // profile
    const profile = await masto.v1.accounts.verifyCredentials();
    console.log({ profile });
    return profile;
  },
})
</script>

<template>
  <div class="profile-card p-4 bg-white shadow rounded">
    <img :src="data?.avatar" alt="Avatar" class="w-16 h-16 rounded-full mx-auto">
    <h2 class="text-center text-xl font-semibold mt-2">{{ data?.displayName }}</h2>
    <p class="text-center text-gray-500">@{{ data?.username }}</p>
    <p class="text-center text-sm text-gray-600">{{ data?.followingCount }} Following</p>
    <p class="text-center text-sm text-gray-600">{{ data?.followersCount }} Followers</p>
    <a :href="data?.url" class="block text-center text-blue-500 mt-4">View Profile</a>
  </div>
</template>
