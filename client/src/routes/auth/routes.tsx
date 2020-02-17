import axios from 'axios';
import { LoginInfo, RegisterInfo, User } from 'src/types/auth';

export async function loggedIn(): Promise<User> {
  try {
    const resp = await axios.get('/user/signed-in', { withCredentials: true });

    if (resp.data && resp.data.user) return resp.data.user;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      throw new Error('auto-login-failed');
    }
    console.log(err);
  }
  throw new Error('crash');
}

export async function logout(): Promise<undefined> {
  try {
    await axios.post('/user/signout', { withCredentials: true });
    return undefined;
  } catch (err) {
    console.log(err);
    throw new Error('crash');
  }
}

export async function login({
  email,
  password,
  rememberMe,
}: LoginInfo): Promise<User> {
  try {
    const resp = await axios.post('/user/signin', {
      email,
      password,
      rememberMe,
    });

    if (resp.data && resp.data.user) return resp.data.user;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      throw new Error('login-failed');
    }
    console.log(err);
  }
  throw new Error('crash');
}

export async function register({
  email,
  password,
}: RegisterInfo): Promise<User> {
  try {
    const resp = await axios.post('/user/signup', { email, password });

    if (resp.data && resp.data.user) return resp.data.user;
  } catch (err) {
    if (err.response && err.response.status === 409) {
      throw new Error('email-taken');
    }
    console.log(err);
  }
  throw new Error('crash');
}
