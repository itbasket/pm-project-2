import CardService from './CardService';
import { createElement, formatDate } from './utils/helpers';
import emitter from './EventEmitter';

export default class Card {
  constructor(data) {
    this.data = data;

    this.nodeElement = this.createNodeElement(this.data);
  }

  createNodeElement(data) {
    const nodeElement = createElement('article', {
      className: 'card',
      draggable: true,
      children: [
        createElement('h3', { className: 'card__title' }, `${data.title}`),
        createElement('p', { className: 'card__description' }, `${data.description}`),
        createElement('div', {
          className: 'card__stats',
          children: [
            createElement('p', {
              children: [
                createElement('', {}, 'Created: '),
                createElement(
                  'span',
                  { className: 'card__date--created' },
                  `${formatDate(data.created_at)}`,
                ),
              ],
            }),
            createElement('p', {
              children: [
                createElement('', {}, 'Updated: '),
                createElement(
                  'span',
                  { className: 'card__date--updated' },
                  `${formatDate(data.updated_at)}`,
                ),
              ],
            }),
          ],
        }),
        createElement('div', {
          className: 'card__options',
          onclick: this.optionsCreate.bind(this),
        }),
      ],
    });

    nodeElement.addEventListener('dragstart', () => {
      nodeElement.classList.add('selected');
    });

    nodeElement.addEventListener('dragend', () => {
      nodeElement.classList.remove('selected');
      emitter.emit('cardsQuantityChanged');
      this.updateCardCategory();
    });

    return nodeElement;
  }

  editCardSumbitHandler(...props) {
    const [title, description, id] = props;

    const newTitle = title.textContent;
    const newDescription = description.textContent;

    title.contentEditable = 'inherit';
    description.contentEditable = 'inherit';

    const newData = {
      id,
      title: newTitle,
      description: newDescription,
    };

    CardService.updateCard(newData)
      .then((response) => {
        this.nodeElement.querySelector('.card__date--updated').textContent = formatDate(
          response.data.updated_at,
        );
      })
      .catch((error) => {
        title.textContent = this.oldContent.title;
        description.textContent = this.oldContent.description;

        const message = createElement('p', {}, `${error.message}`);
        description.after(message);

        setTimeout(() => message.remove(), 2000);
      });
  }

  updateCardCategory() {
    const { id } = this.data;
    const status = this.nodeElement.parentNode.parentNode.getAttribute('data-value');

    CardService.updateCard({ id, status }).then((response) => {
      this.nodeElement.querySelector('.card__date--updated').textContent = formatDate(
        response.data.updated_at,
      );
    });
  }

  optionsCreate(event) {
    const { pageX, pageY } = event;

    if (document.querySelector('.popup-wrapper.options')) {
      document.querySelector('.popup-wrapper.options').remove();
    }

    const wrapper = createElement('div', {
      className: 'popup-wrapper options',
      onclick: () => wrapper.remove(),
    });

    const options = createElement('ul', {
      className: 'options',
      children: [
        createElement('li', {
          children: [
            createElement(
              'button',
              {
                className: 'options__edit',
                onclick: this.optionsEditButtonHandler.bind(this),
              },
              'Edit',
            ),
            createElement(
              'button',
              {
                className: 'options__delete',
                onclick: this.optionsDeleteButtonHandler.bind(this),
              },
              'Delete',
            ),
          ],
        }),
      ],
    });

    options.style.left = `${pageX - 50}px`;
    options.style.top = `${pageY}px`;

    wrapper.append(options);
    this.options = options;
    document.body.prepend(wrapper);
  }

  optionsDelete() {
    this.options.parentNode.remove();
  }

  optionsEditButtonHandler() {
    const title = this.nodeElement.querySelector('.card__title');
    const description = this.nodeElement.querySelector('.card__description');
    const { id } = this.data;

    this.oldContent = {
      title: title.textContent,
      description: description.textContent,
    };

    title.contentEditable = true;
    description.contentEditable = true;

    const optionsSubmit = createElement(
      'button',
      {
        className: 'options__submit',
        onclick: () => {
          this.editCardSumbitHandler(title, description, id);
          optionsSubmit.remove();
        },
      },
      'Save changes',
    );

    description.after(optionsSubmit);

    this.optionsDelete();
  }

  optionsDeleteButtonHandler() {
    const { id } = this.data;

    CardService.deleteCard(id).then(() => {
      this.nodeElement.remove();
      emitter.emit('cardsQuantityChanged');
    });

    this.optionsDelete();
  }

  render(parentNode) {
    parentNode.prepend(this.nodeElement);
  }
}
