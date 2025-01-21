import { type DirectiveBinding, type App } from "vue";
interface clickableElement extends HTMLElement {
  __clickOutsideHandler__: (e: Event) => void;
}

export default {
  install: (app: App) => {
    const clickOutsideDirective = {
      created(el: Element, binding: DirectiveBinding) {
        (el as clickableElement).__clickOutsideHandler__ = (event: Event) => {
          if (
            !(el == event.target || el.contains(event.target as Node | null))
          ) {
            binding.value(event);
          }
        };
        document.body.addEventListener(
          "click",
          (el as clickableElement).__clickOutsideHandler__
        );
      },
      unmounted(el: HTMLElement) {
        document.body.removeEventListener(
          "click",
          (el as clickableElement).__clickOutsideHandler__
        );
      },
    };
    app.directive("click-ouside", clickOutsideDirective);
  },
};
