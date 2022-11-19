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
  email: string;
  password: string;
}

export const login = ({ email, password }: LoginParams) => {
  return axios({
    method: 'POST',
    url: '/pub/login',
    data: {
      email,
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
