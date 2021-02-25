import User from './User';
import Board from './Board';
import CardPopup from './CardPopup';
import CardService from './CardService';
import { createElement, debaunce } from './utils/helpers';

import emitter from './EventEmitter';

class AppUI {
  constructor() {
    this.nodeElement = document.querySelector('#app');
    this.registerListeners = this.registerListeners.bind(this);
    this.render = this.render.bind(this);

    this.createApp();
    this.registerListeners();
  }

  createApp() {
    this.topMenuLogoutButton = createElement(
      'button',
      {
        className: 'top-menu__logout',
        onclick: () => emitter.emit('loggedOut'),
      },
      'Logout',
    );

    this.topMenu = createElement('ul', {
      className: 'top-menu',
      children: [createElement('li', { children: [this.topMenuLogoutButton] })],
    });

    this.search = createElement('input', {
      type: 'text',
      className: 'search',
      placeholder: 'Search for card content',
      oninput: debaunce(this.searchHandler.bind(this), 500),
    });

    this.addCardButton = createElement(
      'button',
      { className: 'add-card', onclick: () => emitter.emit('showCardPopup') },
      'Add new card',
    );

    this.menu = createElement('div', {
      className: 'menu',
      children: [createElement('h1', {}, 'Trello board'), this.search, this.addCardButton],
    });

    this.boardsContainer = createElement('div', { className: 'boards' });

    this.nodeElement.append(this.topMenu, this.menu, this.boardsContainer);
  }

  getBoardsData() {
    return CardService.getStatuses().then((response) => {
      this.createBoards(response.data);
      this.createCardPopup(response.data);
    });
  }

  createBoards(boardsData) {
    this.boards = {};

    boardsData.forEach((item) => {
      const board = new Board();
      board.render(item, this.boardsContainer);
      this.boards[item.value] = board;
    });
  }

  getCardsData() {
    return CardService.getCards().then((response) => {
      response.data.forEach((item) => {
        const targetBoardName = item.status;
        this.boards[targetBoardName].addCard(item);
      });
    });
  }

  createCardPopup(data) {
    this.cardPopup = CardPopup.create(data);
    this.cardPopupSubmit = this.cardPopup.querySelector('.button-add');
    this.cardPopupSubmit.addEventListener('click', this.cardPopupSubmitHandler.bind(this));

    document.body.append(this.cardPopup);
  }

  cardPopupSubmitHandler(e) {
    e.preventDefault();

    const title = this.cardPopup.querySelector('#card-title').value;
    const description = this.cardPopup.querySelector('#card-description').value;
    const status = this.cardPopup.querySelector('#card-category').value;

    CardService.createCard({ title, description, status }).then((response) => {
      const board = response.data.status;
      this.boards[board].addCard(response.data);
      emitter.emit('hideCardPopup');
    });
  }

  registerListeners() {
    emitter.subscribe('showCardPopup', () => {
      this.cardPopup.classList.remove('hidden');
    });

    emitter.subscribe('hideCardPopup', () => {
      this.cardPopup.classList.add('hidden');
    });

    emitter.subscribe('loggedIn', () => {
      this.getBoardsData()
        .then(() => this.getCardsData())
        .then(() => {
          this.userListItem = createElement('li', {}, `Hello, ${User.login}`);
          this.topMenu.prepend(this.userListItem);
          this.render();
        });
    });

    emitter.subscribe('loggedOut', () => {
      User.logout();
      this.boardsContainer.innerHTML = '';
      this.userListItem.remove();
      this.render();
    });

    emitter.subscribe('dragDrop', () => {
      Object.values(this.boards).forEach((board) => {
        board.updateCardsCounter();
      });
    });
  }

  searchHandler() {
    const value = this.search.value.toLowerCase();
    const cards = [...document.querySelectorAll('.card')];

    cards.forEach((card) => {
      if (card.textContent.toLowerCase().includes(value)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  render() {
    if (User.token) {
      this.nodeElement.classList.remove('hidden');
    } else {
      this.nodeElement.classList.add('hidden');
    }
  }
}

export default new AppUI();
