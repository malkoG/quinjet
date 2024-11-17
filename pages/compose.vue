<script setup lang="ts">
import { ref, computed } from "vue";
import { createRestAPIClient } from "masto";
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import QuinjetContainer from "~/components/quinjet-container.vue";
import QuinjetPage from "~/components/quinjet-page.vue";

const attachments = ref(
  [] as { file: File; url: string; filterType: string; filterValue: number, dialogVisible: false }[]
);
const content = ref<string>("");

// DND state
const dragOver = ref(false);

// Placeholder image URL
const placeholderImage = "https://via.placeholder.com/150?text=Upload+Image";

// Initialize Masto client
const masto = createRestAPIClient({
  url: "https://pixelfed.social",
  accessToken: sessionStorage.getItem("accessToken") as string,
});

// Handle file uploads
const onUploadAttachments = (files: FileList | null) => {
  if (files) {
    attachments.value = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      filterType: "",
      filterValue: 100,
      dialogVisible: false
    }));
  }
};

// Handle DND
const onDrop = (event: DragEvent) => {
  event.preventDefault();
  dragOver.value = false;
  if (event.dataTransfer?.files) {
    onUploadAttachments(event.dataTransfer.files);
  }
};

const toggleDialog = (index: number) => {
  attachments.value = attachments.value.map((attachment, i) => {
    if (i === index) {
      attachment.dialogVisible = !attachment.dialogVisible;
    }
    return attachment;
  });
};

const submit = async () => {
  if (attachments.value.length === 0) return;

  // Convert filtered images to Blob using canvas
  const filteredFiles = await Promise.all(
    attachments.value.map((preview) => {
      return new Promise<File>((resolve) => {
        const img = new Image();
        img.src = preview.url;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.filter = `${preview.filterType}(${preview.filterValue}%)`;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) {
                const filteredFile = new File([blob], preview.file.name, {
                  type: preview.file.type,
                });
                resolve(filteredFile);
              }
            }, preview.file.type);
          }
        };
      });
    })
  );

  // Upload filtered files
  const mediaAttachments = await Promise.all(
    filteredFiles.map(async (file) => {
      const result = await masto.v1.media.create({
        file,
      });
      return result;
    })
  );

  const status = await masto.v1.statuses.create({
    mediaIds: mediaAttachments.map((media) => media.id),
    status: content.value,
  });

  location.href = "/";
};

// Handle drag and drop effects
const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  dragOver.value = true;
};

const onDragLeave = () => {
  dragOver.value = false;
};
</script>

<template>
  <QuinjetPage>
    <QuinjetContainer hideNotifications hideComposeButton>
      <!-- Drag-and-Drop Area -->
      <div class="p-4 border-2 border-dashed rounded-lg"
        :class="dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'" @dragover="onDragOver"
        @dragleave="onDragLeave" @drop="onDrop">
        <div class="w-full h-64 flex items-center justify-center cursor-pointer" @click="$refs.fileInput.click()">
          <img :src="placeholderImage" alt="Upload Placeholder" class="w-32 h-32 object-cover" />
        </div>
        <input type="file" ref="fileInput" class="hidden" @change="(e) => onUploadAttachments(e.target.files)" multiple
          accept="image/*" />
      </div>

      <!-- Image Previews with Filters -->
      <div class="grid grid-cols-2 gap-4 aspect-square mt-4">
        <div v-for="(preview, index) in attachments" :key="index" @click="toggleDialog(index)"
          class="relative bg-white shadow-md rounded-lg overflow-hidden flex justify-center items-center">

          <img :src="preview.url" :style="{ filter: `${preview.filterType}(${preview.filterValue}%)` }"
            class="w-full h-39 object-cover" alt="Image Preview" />
          <Dialog v-model:visible="preview.dialogVisible" modal header="Edit Image" :style="{
            width: '400px'
          }">

            <div class="p-2">
              <img :src="preview.url" :style="{ filter: `${preview.filterType}(${preview.filterValue}%)` }"
                class="w-full h-40 object-cover" alt="Image Preview" />

              <label class="block text-sm font-medium text-gray-700">Filter</label>
              <select
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                v-model="preview.filterType">
                <option value="">None</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
                <option value="blur">Blur</option>
                <option value="brightness">Brightness</option>
              </select>
              <div v-if="preview.filterType !== ''" class="mt-2">
                <label class="block text-sm font-medium text-gray-700">Intensity</label>
                <input type="range" min="0" max="200" v-model="preview.filterValue"
                  class="w-full mt-1 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>

            <div class="flex justify-end mt-4">
              <Button type="button" label="Save" @click="toggleDialog(index)"></Button>
            </div>
          </Dialog>
        </div>
      </div>

      <!-- Caption Input -->
      <div class="mt-4">
        <label for="caption" class="block text-sm font-medium text-gray-700">Caption</label>
        <textarea v-model="content" id="caption" rows="4"
          class="mt-1 block w-full shadow-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write a caption..."></textarea>
      </div>

      <!-- Upload Button -->
      <button class="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
        @click="submit">
        Upload
      </button>

    </QuinjetContainer>
  </QuinjetPage>
</template>

<style scoped>
.drag-over {
  border-color: #4f46e5;
  /* Indigo */
  background-color: #eef2ff;
  /* Indigo light */
}
</style>
