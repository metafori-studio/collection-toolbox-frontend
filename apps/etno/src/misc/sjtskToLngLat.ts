import proj4 from 'proj4';

proj4.defs(
  'EPSG:5514',
  '+proj=krovak +lat_0=49.5 +lon_0=24.8333333333333 +alpha=30.2881397527778 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs +axis=swne',
);

// coordinate_x is westing, coordinate_y is southing — swap to (southing, westing) for proj4
function sjtskToLngLat(x: number, y: number): [number, number] {
  return proj4('EPSG:5514', 'WGS84', [y, x]) as [number, number];
}

export default sjtskToLngLat;
