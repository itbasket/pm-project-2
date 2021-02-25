import { createElement } from './utils/helpers';

export default class CardPopup {
  static create(boards) {
    const wrapper = createElement('div', { className: 'popup-wrapper hidden' });
    this.nodeElement = createElement('div', {
      className: 'popup',
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

    wrapper.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.hide();
      }
    });

    wrapper.append(this.nodeElement);
    document.body.append(wrapper);
  }

  static hide() {
    this.nodeElement.parentNode.classList.add('hidden');
    this.title.value = '';
    this.description.value = '';
    [...this.category.children].forEach((option) => {
      option.removeAttribute('selected');
    });
  }

  static show() {
    this.nodeElement.parentNode.classList.remove('hidden');
  }

  static changeStatus(message) {
    this.statusMessage.textContent = message;

    setTimeout(() => {
      this.statusMessage.textContent = '';
    }, 2000);
  }
}
