import { computed, ref, watch, type ComputedRef } from 'vue';
import type { ViewerMediaResource, ViewerDetail } from './media';

interface ImageCollectionProps {
  images?: ViewerMediaResource[];
  modelValue: number;
  detail?: ViewerDetail | null;
}

interface ImageCollectionEvents {
  (event: 'update:modelValue', imageNumber: number): void;
  (event: 'selectImage', index: number): void;
}

export function useImageCollection(
  props: ImageCollectionProps,
  emit: ImageCollectionEvents,
) {
  const currentIndex = ref(Math.max(0, props.modelValue - 1));
  const refreshedUrlOverrides = ref<Record<number, string>>({});
  const images = computed(() => props.images?.length ? props.images : props.detail?.media?.images ?? []);
  const currentImage: ComputedRef<ViewerMediaResource | null> = computed(() => {
    const image = images.value[currentIndex.value];
    if (!image) return null;
    const refreshedUrl = refreshedUrlOverrides.value[currentIndex.value];
    return refreshedUrl ? { ...image, url: refreshedUrl } : image;
  });

  function selectImage(index: number) {
    if (index === currentIndex.value || index < 0 || index >= images.value.length) return;
    currentIndex.value = index;
    emit('update:modelValue', index + 1);
    emit('selectImage', index);
  }

  function previousImage() {
    selectImage(currentIndex.value - 1);
  }

  function nextImage() {
    selectImage(currentIndex.value + 1);
  }

  function overrideImageUrl(index: number, url: string) {
    refreshedUrlOverrides.value = { ...refreshedUrlOverrides.value, [index]: url };
  }

  watch(images, () => {
    refreshedUrlOverrides.value = {};
    currentIndex.value = Math.min(currentIndex.value, Math.max(0, images.value.length - 1));
  });

  watch(
    () => props.modelValue,
    (imageNumber) => {
      const index = imageNumber - 1;
      if (index < 0 || index >= images.value.length) return;
      currentIndex.value = index;
    },
  );

  return {
    currentImage,
    currentIndex,
    images,
    nextImage,
    overrideImageUrl,
    previousImage,
    selectImage,
  };
}
