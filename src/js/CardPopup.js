import { createElement } from './utils/helpers';

export default class CardPopup {
  static create(boards) {
    const nodeElement = createElement('div', {
      className: 'popup hidden',
      children: [
        createElement('form', {
          className: 'add',
          children: [
            createElement('label', { htmlFor: 'card-title' }, 'Enter card title'),
            (this.title = createElement('input', { id: 'card-title', type: 'text' })),
            createElement('label', { htmlFor: 'card-description' }, 'Enter card text'),
            (this.description = createElement('input', { id: 'card-description', type: 'text' })),
            createElement('label', { htmlFor: 'card-category' }, 'Select card category'),
            (this.category = createElement('select', {
              id: 'card-category',
              children: boards.map((board) => {
                const { value, title } = board;
                return createElement('option', { value }, `${title}`);
              }),
            })),
            (this.submit = createElement('button', { className: 'button-add' }, 'Submit')),
          ],
        }),
        (this.statusMessage = createElement('div', { className: 'popup__status-message' })),
        createElement('div', { className: 'close', onclick: () => this.hide() }),
      ],
    });

    this.nodeElement = nodeElement;
  }

  static hide() {
    this.nodeElement.classList.add('hidden');
    this.title.value = '';
    this.description.value = '';
  }

  static show() {
    this.nodeElement.classList.remove('hidden');
    return CardPopup;
  }

  static changeStatus(message) {
    this.statusMessage.textContent = message;

    setTimeout(() => {
      this.statusMessage.textContent = '';
    }, 2000);
  }
}
