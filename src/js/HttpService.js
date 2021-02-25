import API from './utils/API';
import User from './User';
import Loader from './Loader';

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
      headers: {},
    };

    if (auth) {
      options.headers.Authorization = `Bearer ${User.token}`;
    }

    Loader.render();

    return API(options)
      .catch((error) => {
        throw error.response.data;
      })
      .finally(() => {
        Loader.remove();
      });
  }
}
