import { createElement } from './utils/helpers';
import Card from './Card';
import emitter from './EventEmitter';

export default class Board {
  createNodeElement(data) {
    const { title, value } = data;

    this.nodeElement = createElement('section', {
      className: `board ${value}`,
      children: [
        createElement('h2', {}, title),
        createElement('p', {
          className: 'board__stats',
          children: [
            createElement('', {}, 'total '),
            (this.cardsCounterElement = createElement(
              'span',
              {
                className: 'board__stats--total-cards',
              },
              '0',
            )),
          ],
        }),
        (this.cardsContainer = createElement('div', { className: 'cards' })),
        (this.addCardButton = createElement(
          'button',
          {
            className: 'board__add',
            onclick: Board.addCardButtonHandler.bind(this, title),
          },
          'Add card',
        )),
      ],
      ondragover: this.dragoverHandler.bind(this),
    });
    this.nodeElement.setAttribute('data-value', value);

    return this.nodeElement;
  }

  addCard(cardData) {
    const card = new Card(cardData);
    card.render(this.cardsContainer);

    this.updateCardsCounter();
  }

  updateCardsCounter() {
    this.cardsCounterElement.textContent = this.cardsContainer.childNodes.length;
  }

  static addCardButtonHandler(title) {
    emitter.emit('showCardPopup');
    const popup = document.querySelector('.popup .add').parentNode;
    const options = [...popup.querySelector('#card-category').children];

    options.forEach((option) => {
      if (option.textContent === title) {
        option.setAttribute('selected', true);
      }
    });
  }

  dragoverHandler(e) {
    e.preventDefault();

    const container = this.cardsContainer;
    const afterElement = Board.getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.selected');

    if (afterElement) {
      container.insertBefore(draggable, afterElement);
    } else {
      container.appendChild(draggable);
    }
  }

  static getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.selected)')];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }

        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY },
    ).element;
  }

  render(data, parentNode) {
    parentNode.append(this.createNodeElement(data));
  }
}
