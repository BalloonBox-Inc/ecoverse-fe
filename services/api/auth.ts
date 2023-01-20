import axios from '@plugins/axios';
export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  confirmPassword: string;
}

enum URL {
  cookies = '/pub/get-cookies',
  login = '/pub/login',
  logout = '/user/logout',
  register = '/pub/register',
  getUser = '/user',
}

export const setCookies = async () => {
  return (
    await axios({
      method: 'GET',
      url: URL.cookies,
    })
  ).data;
};

export const login = ({ email, password }: LoginParams) => {
  return axios({
    method: 'POST',
    url: URL.login,
    data: {
      email,
      password,
    },
  });
};

export const logout = () => {
  return axios({
    method: 'POST',
    url: URL.logout,
  });
};

export const register = ({
  email,
  password,
  confirmPassword,
}: RegisterParams) => {
  return axios({
    method: 'POST',
    url: URL.register,
    data: {
      email,
      password,
      confirmPassword,
    },
  });
};

export const getUser = async (id: string) => {
  return (
    await axios({
      method: 'GET',
      url: `${URL.getUser}/${id}`,
    })
  ).data;
};
