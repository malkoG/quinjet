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
  <div v-for="status in statuses">
    <status-post :status="status" />
  </div>
</template>
