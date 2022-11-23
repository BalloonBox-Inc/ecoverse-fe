import { MAPBBOX_KEY } from '@config/internal';
import { urlify } from '@utils/helper';
import axios from 'axios';

export interface Place {
  id: string;
  place: string;
  center: [number, number];
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
    center: place.center,
  }));
};
