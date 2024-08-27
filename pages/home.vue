<script setup lang="ts">
import { createRestAPIClient } from "masto";
import { useQuery } from "@tanstack/vue-query";

import StatusPost from "~/components/status-post.vue";
import QuinjetContainer from "~/components/quinjet-container.vue";

import type { Status } from "~/models/status";

const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

const { isPending, isError, data, error } = useQuery({
  queryKey: ['home'],
  queryFn: async () => {
    const statuses = await masto.v1.timelines.home.list() as Status[];
    return statuses;
  },
})
</script>
<template>
  <QuinjetPage>
    <QuinjetContainer>
      <div class="flex justify-center" v-for="status in data">
        <status-post :status="status" />
      </div>
    </QuinjetContainer>
  </QuinjetPage>
</template>
