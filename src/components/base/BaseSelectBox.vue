<script setup lang="ts">
import { shallowRef, watch, type ShallowRef } from "vue";

import { type SelectProps } from "@/types";

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: "",
  label: "",
  items: () => [],
  readonly: false,
  textPath: "$.name",
  keyPath: "$.value",
});
const model = defineModel();

const active: ShallowRef<boolean> = shallowRef<boolean>(false);
const selectedText: ShallowRef<string> = shallowRef<string>("");

watch(model, (newVal) => {
  select(newVal);
});

const getText: (item: any) => string = eval(
  "(item)=>{\
    return " +
    props.textPath.replace(/^\$/, "item") +
    "?.toString();\
  }"
);

function select(item: any): void {
  selectedText.value = item ? getText(item) : "";
  active.value = false;
}
function handleSelectItem(item): void {
  model.value = item;
  active.value = false;
}

if (model.value) select(model.value);
else selectedText.value = "انتخاب کنید";
</script>
<template>
  <div
    class="select"
    :class="{ active: active }"
    v-click-ouside="() => (active = false)"
  >
    <label class="select__label">
      {{ label }}
    </label>
    <div class="select__content" @click="active = !active">
      <div :class="{ active: active }">
        <slot name="prepend"></slot>
        <input
          type="text"
          class="min-w-0 max-w-full h-full flex-grow px-2 inline-block"
          :value="selectedText"
          readonly
          :placeholder="placeholder"
          v-bind="$attrs"
        />
        <slot name="append">
          <svg
            class="size-5 transition-all duration-300 inline-block"
            :class="{ 'rotate-180': active }"
          >
            <use class="size-5" href="/img/icons.svg#arrow-down"></use>
          </svg>
        </slot>
      </div>
      <transition name="fade">
        <div v-if="active" class="select__content__items">
          <ul>
            <li
              v-for="item in items"
              :key="getText(item)"
              v-text="item.name"
              @click="handleSelectItem(item)"
            ></li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<style lang="postcss" scoped>
.select {
  @apply flex flex-col min-w-0 whitespace-nowrap relative w-full text-black box-border p-0 m-0;
  &__content {
    @apply relative;
    > div:first-child {
      @apply flex min-w-0 whitespace-nowrap justify-between border border-gray-100 mt-2 py-2  bg-whitesmoke rounded-xl cursor-pointer;
      &.active {
        @apply rounded-b-none;
      }
    }
    input {
      @apply bg-transparent outline-none rounded cursor-pointer;
      &::placeholder {
        @apply text-gray-500;
      }
    }
    &__items {
      @apply absolute  bg-white border-b border-r border-l border-gray-100 rounded-b-xl left-0 right-0 max-h-32 overflow-y-auto z-10;
      ul > li {
        @apply p-2 cursor-pointer;
        &:hover {
          @apply bg-gray-100;
        }
      }
    }
  }
}
</style>
