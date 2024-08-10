<script setup lang="ts">

import StatusPost from "~/components/status-post.vue";
import type { Status } from "~/models/status";
import { createRestAPIClient } from "masto";

const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

const statuses = await masto.v1.timelines.home.list() as Status[];
</script>
<template>
  <QuinjetPage>
    <div class="container mx-auto grid grid-cols-3 lg:grid-cols-4 gap-x-4">
      <div id="profile" class="col-span-1"></div>
      <div id="feed" class="col-span-2">
        <div v-for="status in statuses">
          <status-post :status="status" />
        </div>
      </div>
      <div id="notifications" class="col-span-1"></div>
    </div>
  </QuinjetPage>
</template>
