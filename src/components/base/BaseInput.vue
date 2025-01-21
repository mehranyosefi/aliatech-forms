<script lang="ts" setup>
import { defineProps, withDefaults, shallowRef, type ShallowRef } from "vue";
withDefaults(
  defineProps<{
    type?: string;
    label?: string;
    value?: string | number | null;
    errorMessage?: string;
  }>(),
  {
    type: "text",
    label: "",
    value: null,
    errorMessage: undefined,
  }
);
const model = defineModel();
const active:ShallowRef<boolean> = shallowRef<boolean>(false);
</script>
<template>
  <div class="input">
    <label class="input__label" v-text="label"></label>
    <div
      class="input__scaffold"
      :class="{
        'input__scaffold--active': active,
        'input__scaffold--invalid': errorMessage,
      }"
    >
      <slot name="prepend"></slot>
      <slot>
        <input
          v-if="type === 'radio' || type === 'checkbox'"
          :type="type"
          v-bind="$attrs"
          v-model="model"
          :value="value"
          @focus="active = true"
          @blur="active = false"
        />
        <input
          v-else
          :type="type"
          v-bind="$attrs"
          v-model="model"
          @focus="active = true"
          @blur="active = false"
        />
      </slot>
      <slot name="append"></slot>
    </div>
    <slot name="error">
      <div v-if="type !== 'radio'" class="input__errormessage">
        <Transition name="fade">
          <span v-if="errorMessage" v-text="errorMessage"></span>
        </Transition>
      </div>
    </slot>
  </div>
</template>

<style lang="postcss">
.input {
  .input__scaffold {
    @apply border border-gray-50 rounded-lg flex items-center justify-center transition duration-300 mt-2 relative bg-whitesmoke;
    input {
      @apply grow border-none outline-none rounded-xl text-black bg-inherit py-2 px-2;
      &::placeholder {
        @apply text-sm text-gray-500;
      }
      &[type="radio"] {
        @apply w-4 h-4 appearance-none border-[2px] border-gray-500 bg-white rounded-full p-1
      cursor-pointer shadow-[0px_0px_0px_1px] shadow-gray-300 transition-colors duration-200;
        &:focus-visible {
          @apply outline-offset-0;
        }
        &:checked {
          @apply shadow-gray-300 border-white bg-yellow-500;
        }
      }
    }
    &--active {
      @apply border-gray-300;
    }
    &--invalid {
      @apply border-red-500;
    }
    &__prepend {
      @apply mx-2;
    }
  }

  &.radio,
  &.checkbox {
    @apply flex flex-row-reverse justify-end items-center;
    .input__scaffold {
      @apply border-none w-fit h-fit m-0;
    }
    .input__label {
      @apply mr-2;
    }
  }
  &.checkbox {
    @apply accent-yellow-500;
  }
  &__errormessage {
    @apply text-red-500 text-sm pt-1 pr-1 h-5;
  }
}
</style>
