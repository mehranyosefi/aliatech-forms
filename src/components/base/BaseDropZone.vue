<script lang="ts" setup>
import { useUploadAbleFile } from "@/composable/useUploadAbleFIle";
import { shallowRef, type ShallowRef } from "vue";
import { FileTypes } from "@/types";

const emit = defineEmits(["files-dropped"]);

const active: ShallowRef<boolean> = shallowRef<boolean>(false);
let inActiveTimeout: ReturnType<typeof setTimeout> | null = null;
const { addFiles, files } = useUploadAbleFile();

function setActive(): void {
  active.value = true;
  if (inActiveTimeout) clearTimeout(inActiveTimeout);
}

function setInactive(): void {
  active.value = false;
  inActiveTimeout = setTimeout(() => {
    active.value = false;
  }, 50);
}

function onDrop(e): void {
  setInactive();
  emit("files-dropped", [...e.dataTransfer.files]);
  addFiles([...e.dataTransfer.files]);
}
function uploadFile(e): void {
  if (e.target.files) addFiles(e.target.files);
}
defineExpose({ files });
</script>

<template>
  <div
    class="dropzone"
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <slot :dropZoneActive="active">
      <div class="dropzone__scaffold" :class="{ active: active }">
        <div v-if="!active && files.length < 1">
          <div class="dropzone__scaffold__input">
            <label for="input-file">
              <svg>
                <use href="/img/icons.svg#cloud-upload"></use>
              </svg>
            </label>
            <input type="file" id="input-file" multiple @change="uploadFile" />
          </div>
          <div>فایل ها را اینجا رها کنید</div>
        </div>
        <div v-else-if="active">فایل را رها کنید</div>
        <div v-else>
          <div class="dropzone__scaffold__files">
            <div v-for="(file, index) in files" :key="index">
              <img
                v-if="
                  file.type === FileTypes.jpg || file.type === FileTypes.png
                "
                :src="file.url"
                :alt="`image of ${file.id}`"
                class="file"
              />
              <iframe
                v-else
                :src="file.url"
                frameborder="0"
                class="file"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>
<style lang="postcss" scoped>
.dropzone {
  &__scaffold {
    @apply w-full max-w-full h-60 max-h-60 overflow-x-hidden bg-whitesmoke z-10 border border-dashed rounded-xl border-gray-200 transition-all
     duration-300 flex flex-wrap items-center justify-center py-3;
    &.active {
      @apply border-green-500;
    }
    &__input {
      label {
        @apply cursor-pointer;
        svg {
          @apply size-10 mx-auto text-gray-500;
        }
        svg,
        use {
          @apply size-10;
        }
      }
      input {
        @apply hidden;
      }
    }
    &__files {
      @apply w-full flex items-center justify-around flex-wrap;
      .file {
        @apply mx-2 border rounded w-56 h-56;
      }
    }
  }
}
</style>
