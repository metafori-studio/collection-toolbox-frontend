import { ref } from 'vue';

export const useListControls = () => {
  const orderBy = ref('id');
  const orderAsc = ref(true);
  const page = ref(1);

  const resetPage = () => {
    page.value = 1;
  };

  const reloadTriggers = [
    orderBy,
    orderAsc,
    page,
  ];

  return { orderBy, orderAsc, page, resetPage, reloadTriggers };
};
