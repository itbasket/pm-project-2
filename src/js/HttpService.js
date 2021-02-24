import API from './utils/API';

export default class HttpService {
  static async request({
    method = 'get',
    url,
    data,
    auth,
  }) {
    const options = {
      method,
      url,
      data: data ?? '',
    };

    if (auth) {
      options.headers.Authorization = `Bearer ${'User.token'}`;
    }

    return API(options)
      .catch((error) => {
        throw error.response.data;
      });
  }
}
