import { MAPBBOX_KEY } from '@config/internal';
import { urlify } from '@utils/helper';
import axios from 'axios';
import Mapbox, { LngLat } from 'mapbox-gl';

export type Center = LngLat;

export interface Place {
  id: string;
  place: string;
  center: Center;
}

const instance = axios.create({
  baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
  params: {
    access_token: MAPBBOX_KEY,
  },
});

export const getPlaces = async (str: string): Promise<Place[]> => {
  const query = `${urlify(str)}.json`;
  const data = (await instance.get(query)).data.features;

  return data.map((place: typeof data[0]) => ({
    id: place.id,
    place: place.place_name,
    center: new Mapbox.LngLat(place.center[0], place.center[1]),
  }));
};
