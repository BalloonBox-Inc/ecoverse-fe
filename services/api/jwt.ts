import { m2ToHaFormat } from '@utils/helper';
import { getAreaFromPolygon, getPolygonUnionFromTiles } from '@utils/map-utils';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';

export async function ecoverseLogin() {
  try {
    const BACKEND_URL = process.env.BACKEND_URL ?? '';
    const BACKEND_USERNAME = process.env.BACKEND_USERNAME ?? '';
    const BACKEND_PASSWORD = process.env.BACKEND_PASSWORD ?? '';

    const dataBody = { username: BACKEND_USERNAME, password: BACKEND_PASSWORD };

    // 👇️ const data: CreateUserResponse
    const { data } = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(dataBody),
      url: `${BACKEND_URL}/api/v1/token`,
    });
    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      console.log('error message: ', error.message);
      // 👇️ error: AxiosError<any, any>
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

export async function updateBackend(nftId: string, tiles: any) {
  try {
    const requestLogin = await ecoverseLogin();
    const BACKEND_URL = process.env.BACKEND_URL ?? '';
    const JWT = `Bearer ${requestLogin}`;
    const polygon = getPolygonUnionFromTiles(tiles.tilesToPurchase);
    const area = getAreaFromPolygon(polygon);
    const YEAR_OFFSET = 1;
    const start = moment.utc();
    const end = start.clone().add(YEAR_OFFSET, 'years');

    const requestBody = {
      nftId,
      nftName: tiles.areaName,
      nftArea: Number(m2ToHaFormat(area)),
      nftValueSol: 1,
      geolocation: JSON.stringify(polygon.geometry),
      tileCount: tiles.tilesToPurchase.length,
      carbonUrl: '', // blank for now
      farmId: tiles.tilesToPurchase[0].data.farmId,
      scientificName: [''], // blank for now
      plantStatus: 'Active', //active for now
      mintStatus: false,
      mintStartDate: start.format(),
      mintEndDate: end.format(),
    };

    // 👇️ const data: CreateUserResponse
    const { data } = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: JWT,
        accept: 'application/json',
      },
      data: JSON.stringify(requestBody),
      url: `${BACKEND_URL}/api/v1/nft/create`,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('error message: ', error.message);
      // 👇️ error: AxiosError<any, any>
      return error.message;
    } else {
      console.error('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}
