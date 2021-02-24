import { createElement } from './utils/helpers';

export default class CardPopup {
  static create(boards) {
    const popup = createElement('div', { className: 'popup hidden' });
    const form = createElement('form', {
      className: 'add',
      children: [
        createElement('label', { htmlFor: 'card-title' }, 'Enter card title'),
        createElement('input', { id: 'card-title', type: 'text' }),
        createElement('label', { htmlFor: 'card-description' }, 'Enter card text'),
        createElement('textarea', { id: 'card-description' }),
        createElement('label', { htmlFor: 'card-category' }, 'Select card category'),
        createElement('select', {
          id: 'card-category',
          children: boards.map((board) => {
            const { value, title } = board;

            return createElement('option', { value }, `${title}`);
          }),
        }),
        createElement('button', { className: 'button-add' }, 'Sumbit'),
      ],
    });
    const statusMessage = createElement('div', { className: 'popup__status-message' });
    const close = createElement('div', {
      className: 'close',
      onclick: () => popup.classList.add('hidden'),
    });

    popup.append(form, statusMessage, close);
    return popup;
  }
}
