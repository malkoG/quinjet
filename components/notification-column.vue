<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { createRestAPIClient } from 'masto';


const masto = createRestAPIClient({
  url: 'https://pixelfed.social',
  accessToken: sessionStorage.getItem('accessToken') as string
})


const { isPending, isError, data, error } = useQuery({
  queryKey: ['notifications'],
  queryFn: async () => {
    const notifications = await masto.v1.notifications.list()
    return notifications
  }
})
</script>

<template>
  <div class="p-4 bg-white shadow rounded">
    <h2 class="text-xl font-bold">Notifications</h2>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <div v-else>
      <div v-for="notification in data" :key="notification.id" class="flex py-1 gap-x-2 justify-between">
        <div class="flex gap-x-2">
          <div class="w-8 aspect-square">
            <img :src="notification.account.avatar" alt="Avatar" class="w-8 h-8 rounded-full aspect-square">
          </div>
          <div class="">
            <div>
              <a :href="notification.account.url" class="font-bold"><b>{{ notification.account.displayName }}</b></a>
              <div v-if="notification.type === 'mention'"><b>mentioned</b> you</div>
              <div v-else-if="notification.type === 'reblog'"><b>reblogged</b> your post</div>
              <div v-else-if="notification.type === 'favourite'"><b>favourited</b> your post</div>
              <div v-else-if="notification.type === 'follow'"><b>followed</b> you</div>
            </div>
          </div>
        </div>
        <div v-if="['reblog', 'favourite'].includes(notification.type)" class="flex justify-end w-6">
          <div class="w-6 h-6 rounded-full">
            <img :src="notification?.status?.mediaAttachments[0].previewUrl" alt="Attachment" class="aspect-square">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
