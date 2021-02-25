import { createElement } from './utils/helpers';

export default class Loader {
  static render() {
    const loader = createElement('div', { className: 'loader' });
    document.body.append(loader);
  }

  static remove() {
    if (document.querySelector('.loader')) {
      document.querySelector('.loader').remove();
    }
  }
}
