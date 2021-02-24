import { createElement } from './utils/helpers';
import Card from './Card';

export default class Board {
  createNodeElement(data) {
    const { title, value } = data;
    const heading = createElement('h2', {}, title);

    const textNode = createElement('', {}, 'total ');
    const cardsCounterElement = createElement(
      'span',
      {
        className: 'board__stats--total-cards',
      },
      '0',
    );
    const stats = createElement('p', {
      className: 'board__stats',
      children: [textNode, cardsCounterElement],
    });

    const cardsContainer = createElement('div', { className: 'cards' });
    const addCardButton = createElement(
      'button',
      {
        className: 'board__add',
        onclick: Board.addCardButtonHandler.bind(this, title),
      },
      'Add card',
    );

    const nodeElement = createElement('section', {
      className: `board ${value}`,
      children: [heading, stats, cardsContainer, addCardButton],
      ondragover: this.dragoverHandler.bind(this),
    });

    this.nodeElement = nodeElement;
    this.cardsCounterElement = cardsCounterElement;
    this.cardsContainer = cardsContainer;
    this.addCardButton = addCardButton;

    return nodeElement;
  }

  addCard(cardData) {
    const card = new Card();
    card.render(cardData, this.cardsContainer);

    this.updateCardsCounter();
  }

  updateCardsCounter() {
    this.cardsCounterElement.textContent = this.cardsContainer.childNodes.length;
  }

  static addCardButtonHandler(title) {
    const popup = document.querySelector('.popup .add').parentNode;
    popup.classList.remove('hidden');
    const options = [...popup.querySelector('#card-category').children];

    options.forEach((option) => {
      if (option.textContent === title) {
        option.setAttribute('selected', 'selected');
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
