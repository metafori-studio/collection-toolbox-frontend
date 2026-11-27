import type { StyleSpecification } from 'mapbox-gl';

// Builds a raster-only Mapbox style from a WMS service (requested as EPSG:3857 tiles)
function createWmsStyle(baseUrl: string, layers: string, attribution: string): StyleSpecification {
  const params = new URLSearchParams({
    service: 'WMS',
    version: '1.1.1',
    request: 'GetMap',
    layers,
    styles: '',
    format: 'image/png',
    transparent: 'false',
    srs: 'EPSG:3857',
    width: '256',
    height: '256',
  });
  return {
    version: 8,
    // Required by symbol layers (e.g. cluster counts)
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    sources: {
      wms: {
        type: 'raster',
        // bbox placeholder must stay unencoded for Mapbox to substitute it
        tiles: [`${baseUrl}?${params.toString()}&bbox={bbox-epsg-3857}`],
        tileSize: 256,
        attribution,
      },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': '#fff' } },
      { id: 'wms', type: 'raster', source: 'wms' },
    ],
  };
}

export default createWmsStyle;
