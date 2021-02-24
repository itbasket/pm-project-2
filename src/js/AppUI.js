import User from './User';
import Board from './Board';
import CardPopup from './CardPopup';
import AuthPopup from './AuthPopup';
import { createElement, debaunce } from './utils/helpers';

import emitter from './EventEmitter';

class AppUI {
  constructor() {
    this.createApp();
    // this.getBoardsData();
    // this.getCardsData();

    this.registerListeners = this.registerListeners.bind(this);
    this.render = this.render.bind(this);
    this.createAuthPopup(); // Move to AuthUI
    this.registerListeners();
  }

  createApp() {
    this.nodeElement = createElement('div', { id: 'app' });
    this.boardsContainer = createElement('div', { className: 'boards' });
    this.topMenuLogoutButton = createElement(
      'button',
      { className: 'top-menu__logout', onlick: () => emitter.emmit('logout') },
      'Logout',
    );
    this.topMenuUser = createElement('li', {}, `Hello, ${User.login}`);
    this.search = createElement('input', {
      type: 'text',
      className: 'search',
      placeholder: 'Search for card content',
      oninput: debaunce(this.searchHandler.bind(this), 500),
    });
    this.addCardButton = createElement(
      'button',
      { className: 'add-card', onclick: () => emitter.emmit('showCardPopup') },
      'Add new card',
    );

    this.nodeElement = createElement('div', {
      id: 'app',
      children: [
        createElement('ul', {
          className: 'top-menu',
          children: [
            this.topMenuUser,
            createElement('li', { children: [this.topMenuLogoutButton] }),
          ],
        }),
        createElement('div', {
          className: 'menu',
          children: [createElement('h1', {}, 'Trello board'), this.search, this.addCardButton],
        }),
        this.boardsContainer,
      ],
    });

    document.body.append(this.nodeElement);
  }

  getBoardsData() {
    // Hardcoded while waiting for Cards Service Component
    const data = [
      {
        id: 1,
        title: 'To Do',
        value: 'to_do',
        published_at: '2021-02-17T06:41:12.627Z',
        created_at: '2021-02-17T06:41:09.433Z',
        updated_at: '2021-02-17T06:41:12.646Z',
      },
      {
        id: 2,
        title: 'In Progress',
        value: 'in_progress',
        published_at: '2021-02-17T06:41:28.539Z',
        created_at: '2021-02-17T06:41:27.476Z',
        updated_at: '2021-02-17T06:41:28.558Z',
      },
      {
        id: 3,
        title: 'Testing',
        value: 'testing',
        published_at: '2021-02-17T06:41:39.633Z',
        created_at: '2021-02-17T06:41:38.438Z',
        updated_at: '2021-02-17T06:41:39.653Z',
      },
      {
        id: 4,
        title: 'Done',
        value: 'done',
        published_at: '2021-02-17T06:41:47.808Z',
        created_at: '2021-02-17T06:41:46.824Z',
        updated_at: '2021-02-17T06:41:47.826Z',
      },
    ];

    this.createBoards(data);
    this.createCardPopup(data);
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
    // Hardcoded while waiting for Cards Service Component
    const data = [
      {
        id: 7,
        title: 'Finish project',
        description: 'Lorem ipsum dolor sit amet...',
        status: 'in_progress',
        published_at: '2021-02-10T19:49:17.748Z',
        created_at: '2021-02-17T18:16:13.782Z',
        updated_at: '2021-02-17T18:16:13.805Z',
      },
      {
        id: 10,
        title: 'UPDATED title',
        description: 'UPDATED description',
        status: 'to_do',
        published_at: '2021-02-18T08:50:42.684Z',
        created_at: '2021-02-18T08:50:42.723Z',
        updated_at: '2021-02-18T08:52:44.934Z',
      },
      {
        id: 6,
        title: 'UPDATED title',
        description: 'UPDATED description',
        status: 'testing',
        published_at: '2021-02-10T19:49:17.748Z',
        created_at: '2021-02-17T18:16:08.129Z',
        updated_at: '2021-02-18T16:47:33.462Z',
      },
      {
        id: 11,
        title: 'Note title',
        description: 'Lorem ipsum dolor sit amet...',
        status: 'testing',
        published_at: '2021-02-18T10:02:00.415Z',
        created_at: '2021-02-18T10:02:00.426Z',
        updated_at: '2021-02-18T16:49:44.857Z',
      },
      {
        id: 97,
        title: 'Note title',
        description: 'Lorem ipsum dolor sit amet...',
        status: 'to_do',
        published_at: '2021-02-22T12:32:15.934Z',
        created_at: '2021-02-22T12:32:15.940Z',
        updated_at: '2021-02-22T12:32:15.947Z',
      },
      {
        id: 98,
        title: '2title',
        description: 'dfsjkhfsdahjksdfahkjsf dahjkdfsasfdsdfa',
        status: 'done',
        published_at: '2021-02-22T12:32:18.464Z',
        created_at: '2021-02-22T12:32:18.469Z',
        updated_at: '2021-02-22T12:32:42.265Z',
      },
    ];

    data.forEach((item) => {
      const targetBoardName = item.status;

      this.boards[targetBoardName].addCard(item);
    });
  }

  createAuthPopup() {
    this.authPopup = AuthPopup.create();

    document.body.append(this.authPopup);
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
    const { value } = this.cardPopup.querySelector('#card-category');

    console.log('POST new card, params:', title, description, value);
  }

  registerListeners() {
    emitter.subscribe('showCardPopup', () => {
      this.cardPopup.classList.remove('hidden');
    });

    emitter.subscribe('loggedIn', () => {
      this.getBoardsData();
      this.getCardsData();
      this.render();
    });

    emitter.subscribe('logout', () => {
      User.logout();
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
