import { ref, computed } from 'vue';

export const filterOpen = ref(window.innerWidth >= 768);
export const filterWidgetWidthRaw = ref(0);
export const filterWidgetWidth = computed(() => filterOpen.value ? filterWidgetWidthRaw.value : 0);
export const detailPanelOpen = ref(true);
export const appTitle = ref<string | null>(null);
export const isLoggedIn = ref(false);
