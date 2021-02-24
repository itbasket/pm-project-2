import { createElement, formatDate } from './utils/helpers';
import emitter from './EventEmitter';

export default class Card {
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
          onclick: this.createActions.bind(this),
        }),
      ],
    });

    nodeElement.setAttribute('card-id', data.id);
    nodeElement.addEventListener('dragstart', () => {
      nodeElement.classList.add('selected');
    });

    nodeElement.addEventListener('dragend', () => {
      nodeElement.classList.remove('selected');
      emitter.emit('dragDrop');
    });

    this.nodeElement = nodeElement;
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

    console.log(newData, this);
  }

  editCardHandler() {
    const title = this.nodeElement.querySelector('.card__title');
    const description = this.nodeElement.querySelector('.card__description');
    const id = this.nodeElement.getAttribute('card-id');

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
      'Submit',
    );

    description.after(optionsSubmit);

    this.deleteActions();
  }

  deleteCardHandler() {
    const board = this.nodeElement.parentNode.parentNode;
    const totalCardsNode = board.querySelector('.board__stats--total-cards');
    const totalCards = +totalCardsNode.textContent - 1;
    totalCardsNode.textContent = totalCards;

    this.nodeElement.remove();
    this.deleteActions();
  }

  createActions() {
    if (document.querySelector('.actions')) {
      document.querySelector('.actions').remove();
    }

    const actions = createElement('ul', {
      className: 'actions',
      children: [
        createElement('li', {
          children: [
            createElement(
              'button',
              {
                className: 'options__edit',
                onclick: this.editCardHandler.bind(this),
              },
              'Edit',
            ),
            createElement(
              'button',
              {
                className: 'options__delete',
                onclick: this.deleteCardHandler.bind(this),
              },
              'Delete',
            ),
            createElement(
              'button',
              {
                className: 'options__cancel',
                onclick: this.deleteActions.bind(this),
              },
              'Cancel',
            ),
          ],
        }),
      ],
    });

    this.actions = actions;
    this.nodeElement.prepend(actions);
  }

  deleteActions() {
    this.actions.remove();
  }

  render(data, parentNode) {
    parentNode.prepend(this.createNodeElement(data));
  }
}
