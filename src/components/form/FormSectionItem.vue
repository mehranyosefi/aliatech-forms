<script setup lang="ts">
import { computed, reactive, watch, type ModelRef, type Reactive } from "vue";
import BaseInput from "../base/BaseInput.vue";
import BaseSelectBox from "../base/BaseSelectBox.vue";
import {
  type ResponseCategory,
  responseCategoryItems,
  ResponseInputType,
} from "@/types";
import BaseButton from "../base/BaseButton.vue";
import BaseDropZone from "../base/BaseDropZone.vue";

defineProps<{
  id: string | number;
  index: number;
  length: number;
}>();
defineEmits([
  "handleRemoveItem",
  "handleDuplicateItem",
  "hanldeUpWardItem",
  "hanldeDownWardItem",
]);

const title: ModelRef<string> = defineModel("title", {
  required: true,
});
const required: ModelRef<boolean> = defineModel("required", { required: true });
const type: ModelRef<ResponseInputType> = defineModel("type", {
  required: true,
});
const properties: ModelRef<Array<{ name: string; value: number } | string>> =
  defineModel("properties", { required: true });
const categoryItems: Reactive<ResponseCategory[]> = reactive(
  responseCategoryItems
);

const category = computed({
  get() {
    return categoryItems.find(({ value }) => value === type.value);
  },
  set(val: ResponseCategory) {
    type.value = val.value;
  },
});

const formData: Reactive<{
  response: string | [];
  reactProperties: Array<{ name: string; value: number } | string>;
}> = reactive<{
  response: string | [];
  reactProperties: Array<{ name: string; value: number } | string>;
}>({
  response: type.value === ResponseInputType.multiple ? [] : "",
  reactProperties: properties.value,
});

watch(category, (newValue) => (type.value = newValue!.value));

function addNewProperty(): void {
  const length = formData.reactProperties.length;
  const newProperty = {
    name: `گزینه ${length + 1}`,
    value: length + 1,
  };
  formData.reactProperties.push(newProperty);
}
</script>

<template>
  <div class="formsection card">
    <div class="formsection__header">
      <div class="formsection__header__title">
        <div class="flex flex-col">
          <BaseInput v-model="title" placeholder="عنوان پرسش"></BaseInput>
        </div>
        <div class="mr-3">
          <BaseSelectBox
            :key="id"
            :items="categoryItems"
            v-model="category"
          ></BaseSelectBox>
        </div>
      </div>
      <div class="formsection__header__options">
        <div class="formsection__header__options__required">
          <div class="relative inline-block w-11">
            <div class="toggle-switch">
              <input
                v-model="required"
                :id="`switch-${id}`"
                type="checkbox"
                class="peer"
              />
              <label
                :for="`switch-${id}`"
                class="peer-checked:translate-x-[-1.4rem] peer-checked:border-gray-500"
              >
              </label>
            </div>
          </div>
          <span v-text="`${required ? 'پاسخ الزامی' : 'پاسخ اختیاری'}`"></span>
        </div>
        <svg @click="$emit('handleRemoveItem', id)">
          <use href="/img/icons.svg#trash-bin"></use>
        </svg>
        <svg @click="$emit('handleDuplicateItem', id)">
          <use href="/img/icons.svg#copy"></use>
        </svg>
        <svg
          :class="{ disabled: index === 0 }"
          @click="index !== 0 && $emit('hanldeUpWardItem', id)"
        >
          <use href="/img/icons.svg#arrow-upward"></use>
        </svg>
        <svg
          :class="{ disabled: index === length - 1 }"
          @click="index !== length - 1 && $emit('hanldeDownWardItem', id)"
        >
          <use href="/img/icons.svg#arrow-downward"></use>
        </svg>
      </div>
    </div>
    <div class="formsection__body">
      <template v-if="type === ResponseInputType.short">
        <BaseInput
          v-model="formData.response as string"
          :type="type"
          placeholder="پاسخ شما"
        ></BaseInput>
      </template>
      <template
        v-else-if="
          type === ResponseInputType.single ||
          type === ResponseInputType.multiple
        "
      >
        <BaseInput
          v-for="(property, index) in formData.reactProperties"
          :key="index"
          :label="property.name"
          :type="type"
          v-model="formData.response"
          :value="property.value"
          :class="[type, 'my-2']"
        ></BaseInput>
        <div>
          <BaseButton class="addProperty outline" @handle-click="addNewProperty"
            >افزودن گزینه جدید</BaseButton
          >
        </div>
      </template>
      <template v-else-if="type === ResponseInputType.long">
        <textarea
          class="textarea h-40"
          v-model="formData.response as string"
          placeholder="پاسخ شما"
        ></textarea>
      </template>
      <template v-else>
        <BaseDropZone />
      </template>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.formsection {
  &__header {
    @apply flex items-start justify-between;
    &__title {
      @apply flex;
    }
    &__options {
      @apply flex items-center mt-2 mr-2;
      &__required {
        @apply flex items-center justify-center border border-gray-100 py-3 rounded-xl w-36;
        span {
          @apply text-gray-500 text-sm mr-2;
        }
      }
      svg {
        @apply mx-2 cursor-pointer text-gray-500 transition-colors;
        &:hover {
          @apply text-black;
        }
        &.disabled {
          @apply text-gray-300 cursor-auto;
          &:hover {
            @apply text-gray-300;
          }
        }
      }
      svg,
      use {
        @apply size-5;
      }
    }
  }
  &__body {
    @apply mt-7;
    .input {
      @apply max-w-72;
    }
    textarea {
      @apply w-full bg-whitesmoke;
    }
    .addProperty {
      @apply text-gray-500 text-sm px-4 outline-gray-100 mt-5 py-1;
    }
  }
}
</style>
