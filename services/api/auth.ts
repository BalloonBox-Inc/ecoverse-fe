import axios from '@plugins/axios';

export const setCookies = async () => {
  return (
    await axios({
      method: 'GET',
      url: '/pub/get-cookies',
    })
  ).data;
};

interface LoginParams {
  username: string;
  password: string;
}

export const login = ({ username, password }: LoginParams) => {
  return axios({
    method: 'POST',
    url: '/pub/login',
    data: {
      username,
      password,
    },
  });
};

export const logout = () => {
  return axios({
    method: 'POST',
    url: '/user/logout',
  });
};
