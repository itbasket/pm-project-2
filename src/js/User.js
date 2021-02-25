export default class User {
  static get token() {
    return window.localStorage.getItem('AUTH_TOKEN');
  }

  static set token(value) {
    window.localStorage.setItem('AUTH_TOKEN', value);
  }

  static get login() {
    return window.localStorage.getItem('USER_LOGIN');
  }

  static set login(value) {
    window.localStorage.setItem('USER_LOGIN', value);
  }

  static logout() {
    window.localStorage.clear();
  }
}
