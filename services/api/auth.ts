import axios from '@plugins/axios';
export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  confirmPassword: string;
}

export const setCookies = async () => {
  return (
    await axios({
      method: 'GET',
      url: '/pub/get-cookies',
    })
  ).data;
};

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

export const register = ({
  email,
  password,
  confirmPassword,
}: RegisterParams) => {
  return axios({
    method: 'POST',
    url: '/pub/register',
    data: {
      email,
      password,
      confirmPassword,
    },
  });
};
