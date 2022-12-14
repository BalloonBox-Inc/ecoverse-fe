import { MAPBBOX_KEY } from '@config/internal';
import { urlify } from '@utils/helper';
import axios from 'axios';
import Mapbox, { LngLat } from 'mapbox-gl';

const BASE_URL = 'https://api.mapbox.com';

export type Center = LngLat;

export interface Place {
  id: string;
  place: string;
  center: Center;
}

const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    access_token: MAPBBOX_KEY,
  },
});

export const getPlaces = async (str: string): Promise<Place[]> => {
  const query = `/geocoding/v5/mapbox.places/${urlify(str)}.json`;
  const data = (await instance.get(query)).data.features;

  return data.map((place: typeof data[0]) => ({
    id: place.id,
    place: place.place_name,
    center: new Mapbox.LngLat(place.center[0], place.center[1]),
  }));
};

export const getPlaceFromLngLat = async (
  lng: number,
  lat: number
): Promise<Place> => {
  const query = `${lng},${lat}.json`;
  const data = (await instance.get(query)).data.features;

  return data[0].place_name;
};

export const getStaticImageUrl = (
  lng: string | number,
  lat: string | number
): string => {
  return `${BASE_URL}/styles/v1/mapbox/satellite-v9/static/${lng},${lat},12,0,0/400x400?access_token=${MAPBBOX_KEY}`;
};
