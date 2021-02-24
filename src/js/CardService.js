import HttpService from './HttpService';

const cardPath = '/cards';
const statusesPath = '/statuses';

export default class CardService {
  static async getCards() {
    return HttpService.request({
      url: cardPath,
      auth: true,
    });
  }

  static async createCard(card) {
    return HttpService.request({
      url: cardPath,
      method: 'POST',
      data: card,
      auth: true,
    });
  }

  static async updateCard(card) {
    return HttpService.request({
      url: `${cardPath}/${card.id}`,
      method: 'PUT',
      data: card,
      auth: true,
    });
  }

  static async deleteCard(id) {
    return HttpService.request({
      url: `${cardPath}/${id}`,
      method: 'DELETE',
      auth: true,
    });
  }

  static async getStatuses() {
    return HttpService.request({
      url: statusesPath,
      auth: true,
    });
  }
}
