import BaseButton from "../base/BaseButton.vue";
interface FormItemProps {
  name: string
  date: Date | string
}

export default function FormItem(props: FormItemProps, context) {
  return (
    <div class='card border p-2'>
      <div class='rounded-xl bg-gray-200 text-center px-10 py-12'>نام فرم</div>
      <div class="my-4"><span class='text-gray-500 text-sm'>12 بهمن 1402</span></div>
      <BaseButton class="w-full py-1 outline !outline-gray-100">
        {{
          default: () => <span>مشاهده فرم</span>,
          prepend: () => <svg class="size-5"><use class="size-5" href='/img/icons.svg#eye-outline'></use></svg>,
        }}
      </BaseButton>
    </div >
  )
}
