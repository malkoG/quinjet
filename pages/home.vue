<script setup lang="ts">

import StatusPost from "~/components/status-post.vue";
import QuinjetContainer from "~/components/quinjet-container.vue";

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
    <QuinjetContainer>
      <div class="flex justify-center" v-for="status in statuses">
        <status-post :status="status" />
      </div>
    </QuinjetContainer>
  </QuinjetPage>
</template>
