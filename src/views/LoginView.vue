<script lang="ts" setup>
import {
  reactive,
  ref,
  shallowRef,
  watch,
  type Reactive,
  type Ref,
  type ShallowRef,
} from "vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import { useUserStore } from "@/composable/useUserStore";
import { loginFormPattern, type LoginFormPatternInterface } from "@/types";

const loginFormStructure: LoginFormPatternInterface = {
  email: "",
  password: "",
};

const formData: Reactive<LoginFormPatternInterface> =
  reactive<LoginFormPatternInterface>({ ...loginFormStructure });

const errors: Reactive<LoginFormPatternInterface> = reactive({
  ...loginFormStructure,
});
const responseError: Ref<string | []> = ref<string>("");
const showPasswordContent: ShallowRef<boolean> = shallowRef<boolean>(false);
const userStore = useUserStore();
const loading: ShallowRef<boolean> = shallowRef(false);

watch(formData, (newVal) => {
  responseError.value = "";
  formValidation(newVal);
});

function formValidation(val: typeof formData, onSubmit = false): void {
  Object.keys(loginFormStructure).forEach((key) => {
    type ErrorsKey = keyof typeof errors;
    type FormKey = keyof typeof formData;
    if (onSubmit) loginFormPattern[key].hasChanged = true;
    if (val[key as FormKey]) {
      loginFormPattern[key].hasChanged = true;
      if (
        !loginFormPattern[key].pattern.test(
          String(val[key as keyof typeof formData])
        )
      ) {
        errors[key as keyof typeof errors] =
          loginFormPattern[key].error.inValid;
      } else errors[key as ErrorsKey] = "";
    } else if (
      loginFormPattern[key].hasChanged &&
      loginFormPattern[key].required
    )
      errors[key as ErrorsKey] = "این فیلد الزامی است";
    else errors[key as ErrorsKey] = "";
  });
}
const inValid = (): boolean => {
  const res = Object.keys(loginFormPattern).some((key) => {
    return (
      (loginFormPattern[key] && !errors[key as keyof typeof errors]) === false
    );
  });
  return res;
};
async function handleSubmit(): Promise<void> {
  formValidation(formData, true);
  if (!inValid()) {
    loading.value = true;
    const res = await userStore.signup(formData);
    loading.value = false;
    if (res) {
      responseError.value = res.data.value?.error;
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="card__header">
        <h1>خوش آمدید</h1>
        <p>برای ورود، ایمیل و رمز عبور خود را وارد کنید</p>
      </div>
      <form @submit.prevent="handleSubmit" class="card__body">
        <BaseInput
          v-model="formData.email"
          label="ایمیل شما"
          type="email"
          :error-message="errors.email"
        >
          <template #prepend>
            <svg>
              <use :href="'/img/icons.svg#mail'"></use>
            </svg>
          </template>
        </BaseInput>
        <BaseInput
          v-model="formData.password"
          :type="`${!showPasswordContent ? 'password' : 'text'}`"
          label="رمز عور"
          placeholder="رمز عبور"
          :error-message="errors.password"
        >
          <template #prepend>
            <svg>
              <use :href="'/img/icons.svg#keyhole-outline'"></use>
            </svg>
          </template>
          <template #append>
            <svg @click="showPasswordContent = !showPasswordContent">
              <Transition name="fade" tag="div">
                <use
                  v-if="!showPasswordContent"
                  href="/img/icons.svg#eye-outline"
                ></use>
                <use v-else href="/img/icons.svg#eye-closed-outline"></use>
              </Transition>
            </svg> </template
        ></BaseInput>
        <div class="errors">
          <Transition name="fade">
            <template v-if="Array.isArray(responseError)">
              <div>
                <span
                  v-for="(e, index) in responseError"
                  :key="index"
                  v-text="e.msg"
                ></span>
              </div>
            </template>
            <template v-else>
              <div v-text="responseError?.detail"></div>
            </template>
          </Transition>
        </div>
        <BaseButton type="submit" :is-loading="loading">ورود</BaseButton>
      </form>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.page {
  @apply h-screen flex items-center justify-center;
  .card {
    @apply w-[24rem];
    &__header {
      @apply mb-8;
      h1 {
        @apply text-2xl;
      }
      p {
        @apply my-4 text-gray-500;
      }
    }
    .input {
      @apply mt-1;
    }
    &__body {
      .btn {
        @apply w-full mt-5 h-10 text-base;
      }
      svg {
        @apply mx-2;
      }
      svg,
      use {
        @apply size-5;
      }
    }
    .errors {
      @apply text-sm text-red-500;
    }
  }
}
</style>
