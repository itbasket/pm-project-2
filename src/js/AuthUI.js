import AuthService from './AuthService';
import emitter from './EventEmitter';

class AuthUI {
  constructor() {
    this.authForm = document.querySelector('.auth');
    this.login = this.authForm.querySelector('#login');
    this.email = this.authForm.querySelector('#email');
    this.password = this.authForm.querySelector('#password');

    this.registerListeners = this.registerListeners.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.render = this.render.bind(this);

    this.registerListeners();
  }

  registerListeners() {
    this.authForm.addEventListener('submit', this.submitHandler);
  }

  submitHandler(ev) {
    ev.preventDefault();
    const mode = this.authForm.querySelector('input[name=options]:checked').id;
    let response;

    if (mode === 'optionLogin') {
      response = AuthService.login({
        identifier: this.login.value,
        password: this.password.value,
      });
    } else {
      response = AuthService.register({
        username: this.login.value,
        email: this.email.value,
        password: this.password.value,
      });
    }

    response.then((res) => {
      if (res.status === 200) {
        localStorage.setItem('AUTH_TOKEN', res.data.jwt);
        emitter.emit('loggedIn');
      }
    });
  }

  render() {
    console.log('render', this);
  }
}

export default new AuthUI();
