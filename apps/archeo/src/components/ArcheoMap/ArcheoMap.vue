<template>
  <div class="relative">
    <div
      ref="mapContainer"
      class="absolute h-[calc(100vh-56px)]"
    />

    <ArcheoMapPopover
      v-if="allowPopover && selectedPoint"
      :id="selectedPoint.id"
      :localization-degree="selectedPoint.localization_degree"
      @close="selectedPoint = null"
    />

    <div class="absolute right-4 bottom-4 flex items-end gap-2">
      <div class="flex items-center gap-2">
        <BaseButton
          v-if="controls.openMaps"
          variant="secondary"
          size="small"
          @click="openMaps()"
        >
          Otvoriť v Maps
        </BaseButton>
        <BaseButton
          v-if="controls.copyCoordinates"
          variant="secondary"
          size="small"
          @click="copyCoordinates()"
        >
          Kopírovať GPS
        </BaseButton>

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
              Legenda
            </div>
            <ul>
              <li>
                <ActivityLevel
                  :level="1"
                  :label="true"
                />
              </li>
              <li>
                <ActivityLevel
                  :level="2"
                  :label="true"
                />
              </li>
              <li>
                <ActivityLevel
                  :level="3"
                  :label="true"
                />
              </li>
            </ul>
          </div>
        </BaseDropdown>

        <BaseButton
          v-if="controls.zoomIn"
          variant="secondary"
          @click="zoomIn()"
        >
          <BaseIcon icon="plus" />
        </BaseButton>
        <BaseButton
          v-if="controls.zoomOut"
          variant="secondary"
          @click="zoomOut()"
        >
          <BaseIcon icon="minus" />
        </BaseButton>
        <BaseButton
          v-if="controls.center"
          variant="secondary"
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
import mapboxgl, { type CameraOptions } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  BaseButton,
  BaseDropdown,
  BaseIcon,
  InputSelect,
} from '@metafori/components';
import ActivityLevel from '@/components/ActivityLevel.vue';
import ArcheoMapPopover from './ArcheoMapPopover.vue';

import sjtskToLngLat from '@/misc/sjtskToLngLat';
import pinLevel1 from '@/assets/map/pin-level1.svg';
import pinLevel2 from '@/assets/map/pin-level2.svg';
import pinLevel3 from '@/assets/map/pin-level3.svg';

export type MapPoint = {
  id: string
  coordinate_x: string
  coordinate_y: string
  localization_degree: number
};

export type MapControls = {
  legend?: boolean
  zoomIn?: boolean
  zoomOut?: boolean
  center?: boolean
  tileType?: boolean
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
    openMaps: false,
    copyCoordinates: false,
  },
  allowPopover = false,
} = defineProps<{
  mapPoints: MapPoint[]
  controls?: MapControls
  allowPopover?: boolean
}>();

// Mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const mapContainer = ref<HTMLDivElement | null>(null);

// Converted and clean map points
const toClean = (pts: MapPoint[]) => pts.map(
  (p) => sjtskToLngLat(Number(p.coordinate_x), Number(p.coordinate_y)),
);
const mapPointsClean = computed(() => toClean(mapPoints));

function calculateDefaultCamera(points: [number, number][]): CameraOptions {
  const DEFAULT_CENTER: [number, number] = [19.7, 49.2];
  const DEFAULT_ZOOM = 7;
  const DEFAULT_SINGLE_POINT_ZOOM = 11;

  if (!points.length) return {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  };

  if (points.length === 1) return {
    center: points[0],
    zoom: DEFAULT_SINGLE_POINT_ZOOM,
  };

  const lng = points.reduce((s, c) => s + c[0], 0) / points.length;
  const lat = points.reduce((s, c) => s + c[1], 0) / points.length;
  return {
    center: [lng, lat],
    zoom: DEFAULT_ZOOM,
  };
}

const MAP_DEFAULT = calculateDefaultCamera(mapPointsClean.value);

type SelectedPoint = { id: string; localization_degree: 1 | 2 | 3 };
const selectedPoint = ref<SelectedPoint | null>(null);

function addPoints() {
  const pointsGeoJSON: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: mapPoints.map((p, i) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: mapPointsClean.value[i]!,
      },
      properties: { id: p.id, localization_degree: p.localization_degree },
    })),
  };

  const pinSrcs: [string, string][] = [
    ['pin-level1', pinLevel1],
    ['pin-level2', pinLevel2],
    ['pin-level3', pinLevel3],
  ];

  Promise.all(
    pinSrcs.map(([name, src]) => new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => { map!.addImage(name, img); resolve(); };
      img.src = src;
    })),
  ).then(() => {
    map!.addSource('points', {
      type: 'geojson',
      data: pointsGeoJSON,
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
        'text-size': 14,
      },
      paint: {
        'text-color': '#fff',
      },
    });

    map!.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': ['match', ['get', 'localization_degree'], 2, 'pin-level2', 3, 'pin-level3', 'pin-level1'],
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
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
      const { id, localization_degree } = feature.properties as SelectedPoint;
      selectedPoint.value = { id, localization_degree };
    });

    map!.on('mouseenter', 'clusters', () => { map!.getCanvas().style.cursor = 'pointer'; });
    map!.on('mouseleave', 'clusters', () => { map!.getCanvas().style.cursor = ''; });
    map!.on('mouseenter', 'points', () => { map!.getCanvas().style.cursor = 'pointer'; });
    map!.on('mouseleave', 'points', () => { map!.getCanvas().style.cursor = ''; });
  });
}

let map: mapboxgl.Map | null = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!mapContainer.value) return;
  map = new mapboxgl.Map({
    cooperativeGestures: true,
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/satellite-v9',
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

const tileType = ref('orto');
const tileTypeOptions = [
  { value: 'orto', label: 'Ortofotomozaika' },
  { value: 'standard', label: 'Štandardná mapa' },
];

watch(() => mapPoints, () => {
  const source = map?.getSource('points') as mapboxgl.GeoJSONSource | undefined;
  if (!source) return;
  source.setData({
    type: 'FeatureCollection',
    features: mapPoints.map((p, i) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: mapPointsClean.value[i]!,
      },
      properties: { id: p.id, localization_degree: p.localization_degree },
    })),
  });
}, { deep: true });

watch(tileType, (key) => {
  const style = tileStyles[key];
  if (style) {
    map?.once('style.load', addPoints);
    map?.setStyle(style);
  }
});

const zoomIn = () => map?.zoomIn();
const zoomOut = () => map?.zoomOut();
const center = () => map?.flyTo(MAP_DEFAULT);
const copyCoordinates = () => {
  const text = mapPointsClean.value
    .map(([lng, lat]: [number, number]) => `${lat}, ${lng}`)
    .join('\n');
  navigator.clipboard.writeText(text);
};
const openMaps = () => {
  if (!mapPointsClean.value.length) return;
  const [lng, lat] = mapPointsClean.value[0]!;
  window.open(`https://www.google.com/maps?q=${lat},${lng}`);
};
</script>
