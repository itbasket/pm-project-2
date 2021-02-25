import AuthService from './AuthService';
import AuthPopup from './AuthPopup';
import emitter from './EventEmitter';
import User from './User';

class AuthUI {
  constructor() {
    this.createAuthPopup();

    this.authForm = this.authPopup.querySelector('.auth');
    this.messageContainer = this.authPopup.querySelector('.popup__status-message');

    this.login = this.authForm.querySelector('#login');
    this.email = this.authForm.querySelector('#email');
    this.password = this.authForm.querySelector('#password');
    this.buttons = [...this.authForm.querySelectorAll('button')];

    this.registerListeners = this.registerListeners.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.render = this.render.bind(this);

    this.registerListeners();
  }

  registerListeners() {
    this.authForm.addEventListener('submit', this.submitHandler);

    emitter.subscribe('loggedOut', () => {
      this.render();
    });
  }

  createAuthPopup() {
    this.authPopup = AuthPopup.create();

    document.body.append(this.authPopup);
  }

  submitHandler(ev) {
    ev.preventDefault();

    this.buttons.forEach((button) => button.setAttribute('disabled', true));
    this.messageContainer.innerHTML = '';

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

    response
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('AUTH_TOKEN', res.data.jwt);
          localStorage.setItem('USER_LOGIN', res.data.user.username);
          this.authPopup.classList.add('hidden');
          emitter.emit('loggedIn');
        }
      })
      .catch((error) => {
        this.messageContainer.innerHTML = error.message[0].messages[0].message;
      })
      .finally(() => {
        this.buttons.forEach((button) => button.removeAttribute('disabled'));
      });
  }

  render() {
    if (User.token) {
      this.authPopup.classList.add('hidden');
      emitter.emit('loggedIn');
    } else {
      this.authPopup.classList.remove('hidden');
    }
  }
}

export default new AuthUI();
