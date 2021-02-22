import HttpService from './HttpService';

export default class AuthService {
  static async login({ identifier, password }) {
    HttpService.request({
      method: 'post',
      url: '/auth/local',
      data: {
        identifier,
        password,
      },
      auth: false,
    });
  }

  static async register({ username, email, password }) {
    HttpService.request({
      method: 'post',
      url: '/auth/local/register',
      data: {
        username,
        email,
        password,
      },
      auth: false,
    });
  }
}
