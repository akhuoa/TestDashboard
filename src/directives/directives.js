import { onUnmounted } from "vue"

const focusOn = {mounted: (el) => el.focus()}

const clickOut = {
    mounted: (el, binding, vnode) => {
        el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
              binding.value();
            }
          };
          document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el){
        document.removeEventListener('click', el.clickOutsideEvent)
      }
  };

  export { focusOn, clickOut }