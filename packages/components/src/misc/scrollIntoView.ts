import type { Directive } from 'vue';

const scrollOptions: ScrollIntoViewOptions = { block: 'nearest', inline: 'nearest' };

const vScrollIntoView: Directive<HTMLElement, boolean> = {
  mounted(el, binding) {
    if (binding.value) {
      el.scrollIntoView?.(scrollOptions);
    }
  },
  updated(el, binding) {
    if (binding.value && !binding.oldValue) {
      el.scrollIntoView?.({ ...scrollOptions, behavior: 'smooth' });
    }
  },
};

export {
  vScrollIntoView,
};
