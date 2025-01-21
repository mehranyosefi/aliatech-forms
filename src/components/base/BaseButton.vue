<script lang="ts" setup>
import router from "@/router";

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    bg?: string;
    isLoading?: boolean;
    to?: string;
  }>(),
  {
    type: undefined,
    bg: "var(--black)",
    isLoading: false,
    to: undefined,
  }
);
const emit = defineEmits(["handleClick"]);

function handleOnClik(): void {
  if (props.to) router.push(props.to);
  else emit("handleClick");
}
</script>

<template>
  <button class="btn" :type="type" @click="handleOnClik">
    <template v-if="!isLoading">
      <slot name="prepend"></slot>
      <slot />
    </template>
    <div v-else class="loader"></div>
    <slot name="append"></slot>
  </button>
</template>

<style lang="css" scoped>
.btn {
  background: v-bind(bg);
  @apply border-none rounded-xl text-white cursor-pointer flex items-center justify-center
  min-w-20 min-h-10 transition-all duration-300;

  .loading {
    @apply mr-1 w-12;
  }
  &:hover {
    filter: brightness(1.25);
  }
  &.outline {
    outline-width: 1px;
    color: v-bind(bg);
    @apply bg-transparent;

    &:hover {
      background: v-bind(bg);
      @apply text-white;
    }
  }
}
</style>
