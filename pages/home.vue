<script setup lang="ts">
import { createRestAPIClient } from "masto";
import { useQuery, useInfiniteQuery } from "@tanstack/vue-query";
import { ref } from 'vue'
import { useInfiniteScroll, useThrottleFn } from '@vueuse/core'

import StatusPost from "~/components/status-post.vue";
import QuinjetContainer from "~/components/quinjet-container.vue";

import type { Status } from "~/models/status";

const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

const containerRef = ref<HTMLElement | null>(null)

const fetchStatuses = useThrottleFn(async ({ pageParam }) => {
  const statuses = await masto.v1.timelines.home.list({
    limit: 20, // Number of items to load per page
    maxId: pageParam as string | undefined,
  }) as Status[];

  return statuses;
}, 2000);

const { isPending, isError, data, error, fetchNextPage, hasNextPage } =
  useInfiniteQuery<Status[], Error>
    ({
      queryKey: ['home'],
      queryFn: fetchStatuses,
      initialPageParam: undefined,
      getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
        lastPage.length ? lastPage[lastPage.length - 1].id : undefined
    });

useInfiniteScroll(
  containerRef,
  () => {
    if (hasNextPage.value && !isPending.value) {
      fetchNextPage();
    }
  },
  {
    // You can adjust these settings to your liking
    distance: 200, // Load more when 50px away from the bottom
  }
);

</script>
<template>
  <QuinjetPage ref="containerRef">
    <QuinjetContainer>
      <template v-for="page in data?.pages">
        <div class="flex justify-center" v-for="status in page" :key="status.id">
          <status-post :status="status" />
        </div>
      </template>
    </QuinjetContainer>
  </QuinjetPage>
</template>
