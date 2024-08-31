<script setup lang="ts">
const route = useRoute()

import { createRestAPIClient } from 'masto';
import { AspectRatio } from 'radix-vue';

import QuinjetPage from '~/components/quinjet-page.vue';
import StatusThumbnail from '~/components/status-thumbnail.vue';
import type { Status } from '~/models/status';

const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

const fetchProfile = async () => {
  const profile = await masto.v1.accounts.$select(route.params.id.toString()).fetch();
  return profile;
}

const profile = await fetchProfile();

const fetchStatuses = async () => {
  const statuses = await masto.v1.accounts.$select(route.params.id.toString()).statuses.list({
    limit: 20,
  });
  return statuses as Status[];
}

const statuses = await fetchStatuses()
</script>

<template>
  <QuinjetPage>
    <div class="lg:container mx-auto block sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      <div id="profile" class="col-span-2 md:col-span-1 mx-4">
        <div class="flex sm:block">
          <div id="profile-image" class="w-48 sm:w-64 md:w-full pr-4 sm:pr-12 flex-2">
            <AspectRatio :ratio="1">
              <img class="max-w-48 max-h-48 sm:max-w-64 sm:max-h-64 w-full h-full rounded-full" :src="profile.avatar"
                alt="Profile Image" />
            </AspectRatio>
            <div class="mt-4 hidden sm:block">
              <span class="text-xl font-black">{{ profile.displayName }}</span>
              <div v-html="profile.note"></div>
            </div>
            <div>
            </div>
          </div>
          <div class="mt-4 w-full flex-3">
            <ProfileIndicator :account="profile" />
          </div>
        </div>
      </div>
      <div class="mx-4 block sm:hidden py-4">
        <span class="text-xl font-black">{{ profile.displayName }}</span>
        <div v-html="profile.note"></div>
      </div>
      <div id="feed" class="col-span-2 lg:col-span-3 mx-4">
        <div class="grid grid-cols-3 gap-4">
          <div v-for="status in statuses" :key="status.id">
            <StatusThumbnail :status="status" />
          </div>
        </div>
      </div>
    </div>
  </QuinjetPage>
</template>
