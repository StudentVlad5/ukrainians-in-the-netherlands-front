export interface ILocationPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string]; // [lat_min, lat_max, lon_min, lon_max]
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  addresstype: string;
  name: string;
  place_rank: number;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}
