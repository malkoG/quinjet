<script setup lang="ts">
import { createRestAPIClient } from "masto";


const attachments = defineModel('attachments', {
  type: FileList || null,
  default: null,
});

const attachmentPreviews = computed(() => {
  return Array.from(attachments.value || []).map((file) => URL.createObjectURL(file));
});

const content = defineModel("content", {
  type: String,
  default: "",
});

const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

const onUploadAttachments = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) {
    return;
  }

  attachments.value = files;
};

const submit = async (e: Event) => {
  const files = attachments.value || new FileList();
  console.log({ files });
  if (files.length === 0) {
    return;
  }

  const status = content.value;
  composeWithMultipleAttachments({ files, status });
};

const composeWithMultipleAttachments = async (props: { files: FileList, status: string }) => {
  const mediaAttachments = await Promise.all(Array.from(props.files).map(async (file) => {
    const result = await masto.v1.media.create({
      file,
    });

    return result;
  }));

  const status = await masto.v1.statuses.create({
    mediaIds: mediaAttachments.map((media) => media.id),
    status: props.status,
  });

  console.log(status);
}

</script>

<template>
  <QuinjetPage>
    <div class="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
      <div id="profile" class="md:col-span-1"></div>
      <div id="feed" class="col-span-2">
        <div class="overflow-x-scroll w-full flex gap-x-4">
          <template v-for="previewUrl in attachmentPreviews">
            <img :src="previewUrl" class="h-64 w-64 object-cover" />
          </template>
        </div>
        <div>
          <label for="file" class="block text-sm font-medium text-gray-700">File</label>
          <input type="file" name="file" @change="onUploadAttachments" multiple accept="image/*"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
        </div>
        <div>
          <label for="caption" class="block text-sm font-medium text-gray-700">Caption</label>
          <textarea v-model="content" id="caption" name="caption" rows="5"
            class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 border-2 rounded-md bg-white"></textarea>
        </div>
        <button type="submit" @click="submit"
          class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Upload</button>
      </div>
      <div id="notifications" class="hidden lg:block lg:col-span-1"></div>
    </div>
  </QuinjetPage>
</template>
