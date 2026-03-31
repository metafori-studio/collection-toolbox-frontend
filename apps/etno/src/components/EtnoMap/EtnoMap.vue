<template>
  <div class="relative">
    <div
      ref="mapContainer"
      class="absolute h-[400px] md:h-[calc(100vh-56px)]"
    />

    <ModalWindow
      :is-open="!!selectedMultiPoints"
      @close="selectedMultiPoints = null"
    >
      <div class="flex flex-col gap-4">
        <h2 class="text-heading-4">
          {{ $t('map.selectRecord') }}
        </h2>
        <ul class="flex flex-col gap-2">
          <li
            v-for="id in selectedMultiPoints"
            :key="id"
          >
            <BaseButton
              variant="secondary"
              block
              @click="navigateToDetail(id)"
            >
              {{ id }}
            </BaseButton>
          </li>
        </ul>
      </div>
    </ModalWindow>

    <div class="absolute left-4 top-4 flex gap-2">
      <BaseButton
        v-if="controls.openMaps"
        variant="secondary"
        size="small"
        @click="openMaps()"
      >
        {{ $t('map.openInMaps') }}
      </BaseButton>
      <BaseButton
        v-if="controls.copyCoordinates"
        variant="secondary"
        size="small"
        @click="copyCoordinates()"
      >
        {{ $t('map.copyCoordinates') }}
      </BaseButton>
    </div>

    <div class="absolute right-4 bottom-4 flex items-end gap-2">
      <div class="flex items-center gap-2">
        <InputSelect
          v-if="controls.tileType"
          v-model="tileType"
          :options="tileTypeOptions"
        />
      </div>
      <div class="flex flex-col gap-2 w-fit">
        <BaseDropdown
          v-if="controls.legend"
          variant="secondary"
          direction="top-left"
        >
          <template #trigger>
            <BaseIcon icon="info" />
          </template>
          <div class="p-4">
            <div class="text-label mb-2">
              {{ $t('map.legend') }}
            </div>
          </div>
        </BaseDropdown>

        <BaseButton
          v-if="controls.terrain3d"
          variant="secondary"
          :aria-label="is3D ? $t('map.toggle2D') : $t('map.toggle3D')"
          @click="toggle3D()"
        >
          {{ is3D ? '2D' : '3D' }}
        </BaseButton>
        <BaseButton
          v-if="controls.zoomIn"
          variant="secondary"
          :aria-label="$t('map.zoomIn')"
          @click="zoomIn()"
        >
          <BaseIcon icon="plus" />
        </BaseButton>
        <BaseButton
          v-if="controls.zoomOut"
          variant="secondary"
          :aria-label="$t('map.zoomOut')"
          @click="zoomOut()"
        >
          <BaseIcon icon="minus" />
        </BaseButton>
        <BaseButton
          v-if="controls.center"
          variant="secondary"
          :aria-label="$t('map.center')"
          @click="center()"
        >
          <BaseIcon icon="gpsFix" />
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import mapboxgl, { type CameraOptions } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  BaseButton,
  BaseDropdown,
  BaseIcon,
  InputSelect,
  ModalWindow,
} from '@metafori/components';

export type MapPoint = {
  id: string
  latitude: string
  longitude: string
};

type MergedPoint = {
  ids: string[]
  coordinates: [number, number]
};

export type MapControls = {
  legend?: boolean
  zoomIn?: boolean
  zoomOut?: boolean
  center?: boolean
  tileType?: boolean
  terrain3d?: boolean
  openMaps?: boolean
  copyCoordinates?: boolean
};

const {
  mapPoints,
  controls = {
    legend: false,
    zoomIn: true,
    zoomOut: true,
    center: false,
    tileType: true,
    terrain3d: false,
    openMaps: false,
    copyCoordinates: false,
  },
} = defineProps<{
  mapPoints: MapPoint[]
  controls?: MapControls
}>();

const { t } = useI18n();

// Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapContainer = ref<HTMLDivElement | null>(null);

function mergePoints(pts: MapPoint[]): MergedPoint[] {
  const map = new Map<string, MergedPoint>();
  for (const p of pts) {
    const key = `${p.longitude},${p.latitude}`;
    if (map.has(key)) {
      map.get(key)!.ids.push(p.id);
    } else {
      map.set(key, {
        ids: [p.id],
        coordinates: [Number(p.longitude), Number(p.latitude)],
      });
    }
  }
  return Array.from(map.values());
}

const mergedPoints = computed(() => mergePoints(mapPoints));

function calculateDefaultCamera(points: MergedPoint[]): CameraOptions {
  const DEFAULT_CENTER: [number, number] = [15, 54];
  const DEFAULT_ZOOM = 3;
  const DEFAULT_SINGLE_POINT_ZOOM = 11;

  if (!points.length) return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
  if (points.length === 1) return { center: points[0]!.coordinates, zoom: DEFAULT_SINGLE_POINT_ZOOM };

  const lng = points.reduce((s, c) => s + c.coordinates[0], 0) / points.length;
  const lat = points.reduce((s, c) => s + c.coordinates[1], 0) / points.length;
  return { center: [lng, lat], zoom: DEFAULT_ZOOM };
}

const MAP_DEFAULT = calculateDefaultCamera(mergedPoints.value);

const router = useRouter();
const selectedMultiPoints = ref<string[] | null>(null);

function navigateToDetail(id: string) {
  selectedMultiPoints.value = null;
  router.push({ name: 'Detail', params: { id } });
}

function buildGeoJSON(pts: MergedPoint[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: pts.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: p.coordinates },
      properties: { ids: JSON.stringify(p.ids), count: p.ids.length },
    })),
  };
}

function addPoints() {
  map!.addSource('points', {
    type: 'geojson',
    data: buildGeoJSON(mergedPoints.value),
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map!.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'points',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#171717',
      'circle-radius': 16,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFF',
    },
  });

  map!.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'points',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-size': 16,
    },
    paint: { 'text-color': '#fff' },
  });

  map!.addLayer({
    id: 'points',
    type: 'circle',
    source: 'points',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#3B82F6',
      'circle-radius': 16,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#FFF',
    },
  });

  map!.addLayer({
    id: 'points-label',
    type: 'symbol',
    source: 'points',
    filter: ['all', ['!', ['has', 'point_count']], ['>', ['get', 'count'], 1]],
    layout: {
      'text-field': ['to-string', ['get', 'count']],
      'text-size': 16,
    },
    paint: { 'text-color': '#fff' },
  });

  map!.on('click', 'clusters', (e) => {
    const features = map!.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    const feature = features[0];
    if (!feature) return;
    const clusterId = feature.properties!.cluster_id;
    (map!.getSource('points') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err || zoom == null) return;
      map!.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom });
    });
  });

  map!.on('click', 'points', (e) => {
    const feature = e.features?.[0];
    if (!feature) return;
    let ids: string[];
    try {
      const parsed = JSON.parse(feature.properties!.ids);
      if (!Array.isArray(parsed) || !parsed.every((x) => typeof x === 'string')) return;
      ids = parsed;
    } catch {
      return;
    }
    if (ids.length === 1) {
      router.push({ name: 'Detail', params: { id: ids[0] } });
    } else {
      selectedMultiPoints.value = ids;
    }
  });

  map!.on('mouseenter', 'clusters', () => { map!.getCanvas().style.cursor = 'pointer'; });
  map!.on('mouseleave', 'clusters', () => { map!.getCanvas().style.cursor = ''; });
  map!.on('mouseenter', 'points', () => { map!.getCanvas().style.cursor = 'pointer'; });
  map!.on('mouseleave', 'points', () => { map!.getCanvas().style.cursor = ''; });
}

let map: mapboxgl.Map | null = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!mapContainer.value) return;
  map = new mapboxgl.Map({
    cooperativeGestures: true,
    container: mapContainer.value,
    style: 'mapbox://styles/metafori/cmmm3fxgm009m01sb54ebhktg',
    center: MAP_DEFAULT.center,
    zoom: MAP_DEFAULT.zoom,
    scrollZoom: { around: 'center' },
    attributionControl: false,
  });

  map.once('style.load', addPoints);

  resizeObserver = new ResizeObserver(() => map?.resize());
  resizeObserver.observe(mapContainer.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  map?.remove();
});

// Custom map controls
const tileStyles: Record<string, string> = {
  orto: 'mapbox://styles/mapbox/satellite-v9',
  standard: 'mapbox://styles/mapbox/streets-v12',
};

const tileType = ref('standard');
const tileTypeOptions = computed(() => [
  { value: 'orto', label: t('map.tileTypes.orthophoto') },
  { value: 'standard', label: t('map.tileTypes.standard') },
]);

watch(() => mapPoints, (newVal, oldVal) => {
  const source = map?.getSource('points') as mapboxgl.GeoJSONSource | undefined;
  if (!source) return;
  source.setData(buildGeoJSON(mergedPoints.value));
  if (!oldVal?.length && newVal.length) {
    map?.flyTo(calculateDefaultCamera(mergedPoints.value));
  }
}, { deep: true });

watch(tileType, (key) => {
  const style = tileStyles[key];
  if (style) {
    map?.once('style.load', addPoints);
    map?.setStyle(style);
  }
});

const is3D = ref(false);

function toggle3D() {
  if (!map) return;
  is3D.value = !is3D.value;
  if (is3D.value) {
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
    }
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 3 });
    map.easeTo({ pitch: 60, duration: 500 });
  } else {
    map.setTerrain(null);
    map.easeTo({ pitch: 0, duration: 500 });
  }
}

const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();
const center = () => map?.flyTo(MAP_DEFAULT);
const copyCoordinates = () => {
  const text = mergedPoints.value
    .map(({ coordinates: [lng, lat] }) => `${lat}, ${lng}`)
    .join('\n');
  navigator.clipboard.writeText(text);
};
const openMaps = () => {
  if (!mergedPoints.value.length) return;
  const [lng, lat] = mergedPoints.value[0]!.coordinates;
  window.open(`https://www.google.com/maps?q=${lat},${lng}`);
};
</script>
