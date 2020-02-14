import axios from 'axios';

function loggedIn() {
  return axios.get('/user/signed-in', { withCredentials: true });
}

function logout() {
  return axios.post('/user/signout', { withCredentials: true });
}

function login({ email, password, rememberMe }) {
  return axios.post('/user/signin', { email, password, rememberMe });
}

function register({ email, password }) {
  return axios.post('/user/signup', { email, password });
}

export default {
  loggedIn,
  logout,
  login,
  register,
};
