import User from './User';
import Board from './Board';
import CardPopup from './CardPopup';
import CardService from './CardService';
import { createElement, debaunce } from './utils/helpers';
import emitter from './EventEmitter';
import Loader from './Loader';

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
    return CardService.getStatuses()
      .then((response) => {
        this.createBoards(response.data);
        this.createCardPopup(response.data);
      })
      .catch((error) => {
        if (error.error === 'Unauthorized') {
          emitter.emit('badToken');
        }
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
    CardPopup.create(data);
    CardPopup.submit.addEventListener('click', this.addCard.bind(this));
  }

  addCard(e) {
    e.preventDefault();

    const title = CardPopup.title.value.trim();
    const description = CardPopup.description.value.trim();
    const status = CardPopup.category.value;

    if (!title || !description) {
      CardPopup.changeStatus('Please, fill all fields');
      return;
    }

    CardService.createCard({ title, description, status })
      .then((response) => {
        const board = response.data.status;
        this.boards[board].addCard(response.data);
        emitter.emit('hideCardPopup');
      })
      .catch(() => {
        CardPopup.changeStatus('Something went wrong!');
      });
  }

  registerListeners() {
    emitter.subscribe('showCardPopup', () => {
      CardPopup.show();
    });

    emitter.subscribe('hideCardPopup', () => {
      CardPopup.hide();
    });

    emitter.subscribe('loggedIn', () => {
      Loader.render();
      this.getBoardsData()
        .then(() => this.getCardsData())
        .then(() => {
          this.userListItem = createElement('li', {}, `Hello, ${User.login}`);
          this.topMenu.prepend(this.userListItem);
          Loader.remove();
          this.nodeElement.classList.remove('hidden');
        });
    });

    emitter.subscribe('loggedOut', () => {
      User.logout();
      this.boardsContainer.innerHTML = '';
      this.userListItem.remove();
      CardPopup.nodeElement.remove();
      Loader.remove();
      this.render();
    });

    emitter.subscribe('badToken', () => {
      User.logout();
      this.boardsContainer.innerHTML = '';
      Loader.remove();
      this.render();

      const authPopup = document.querySelector('.popup');
      authPopup.classList.remove('hidden');
      const statusMessage = authPopup.querySelector('.popup__status-message');
      statusMessage.innerHTML = 'Bad Authorisation token. Please, login again';
    });

    emitter.subscribe('cardsQuantityChanged', () => {
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
    this.nodeElement.classList.add('hidden');
  }
}

export default new AppUI();
