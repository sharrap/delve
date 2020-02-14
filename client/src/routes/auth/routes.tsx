import axios from 'axios';
import { AxiosPromise } from 'axios';
import { LoginInfo, RegisterInfo } from './types';

export function loggedIn(): AxiosPromise {
  return axios.get('/user/signed-in', { withCredentials: true });
}

export function logout(): AxiosPromise {
  return axios.post('/user/signout', { withCredentials: true });
}

export function login({
  email,
  password,
  rememberMe,
}: LoginInfo): AxiosPromise {
  return axios.post('/user/signin', { email, password, rememberMe });
}

export function register({ email, password }: RegisterInfo): AxiosPromise {
  return axios.post('/user/signup', { email, password });
}
