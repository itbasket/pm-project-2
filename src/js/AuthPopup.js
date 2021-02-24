import { createElement } from './utils/helpers';

export default class AuthPopup {
  static create() {
    const form = createElement('form', {
      className: 'auth',
      children: [
        createElement('input', {
          type: 'radio',
          id: 'optionLogin',
          name: 'options',
          checked: true,
        }),
        createElement('label', { htmlFor: 'optionLogin' }, 'Login'),
        createElement('input', { type: 'radio', id: 'optionRegister', name: 'options' }),
        createElement('label', { htmlFor: 'optionRegister' }, 'Register'),
        createElement('label', { htmlFor: 'login' }, 'Enter login'),
        createElement('input', { required: true, id: 'login', type: 'text' }),
        createElement('label', { htmlFor: 'email' }, 'Enter email'),
        createElement('input', { id: 'email', type: 'email' }),
        createElement('label', { htmlFor: 'password' }, 'Enter password'),
        createElement('input', { required: true, id: 'password', type: 'password' }),
        createElement('button', { className: 'button-register' }, 'Register'),
        createElement('button', { className: 'button-login' }, 'Login'),
      ],
    });
    const statusMessage = createElement('div', { className: 'popup__status-message' });

    return createElement('div', { className: 'popup', children: [form, statusMessage] });
  }
}
