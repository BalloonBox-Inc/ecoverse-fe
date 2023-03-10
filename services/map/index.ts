import { MAPBBOX_KEY } from '@config/internal';
import { urlify } from '@utils/helper';
import { getCenterFromLngLat } from '@utils/map-utils';
import axios from 'axios';
import { LngLat } from 'mapbox-gl';

const BASE_URL = 'https://api.mapbox.com';

export type Center = LngLat;

export interface Place {
  id: string;
  place: string;
  center: Center;
}

const instance = axios.create({
  baseURL: `${BASE_URL}/geocoding/v5/mapbox.places`,
  params: {
    access_token: MAPBBOX_KEY,
  },
});

// TODO: deprecated
export const getPlaces = async (str: string): Promise<Place[]> => {
  const query = `/${urlify(str)}.json`;
  const response = await instance.get(query);
  const data = response.data.features;

  return data.map((place: typeof data[0]) => {
    return {
      id: place.id,
      place: place.place_name,
      center: getCenterFromLngLat(place.center[0], place.center[1]),
    };
  });
};

export const getPlaceFromLngLat = async (
  lng: number,
  lat: number
): Promise<Place> => {
  const query = `/${lng},${lat}.json`;
  const data = (await instance.get(query)).data.features;

  return data[0].place_name;
};

export const getStaticImageUrl = (
  lng: string | number,
  lat: string | number
): string => {
  return `${BASE_URL}/styles/v1/mapbox/satellite-v9/static/${lng},${lat},12,0,0/400x400?access_token=${MAPBBOX_KEY}`;
};
