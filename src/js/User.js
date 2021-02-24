export default class User {
  static get token() {
    return window.localStorage.getItem('token');
  }

  static set token(value) {
    window.localStorage.setItem('token', value);
  }

  static get login() {
    return window.localStorage.getItem('login');
  }

  static set login(value) {
    window.localStorage.setItem('login', value);
  }

  static logout() {
    window.localStorage.clear();
  }
}
