import HttpService from './HttpService';
import config from './utils/config';

export default class CardService {
  static async getCards() {
    return HttpService.request({
      url: config.cardPath,
      auth: true,
    });
  }

  static async createCard(card) {
    return HttpService.request({
      url: config.cardPath,
      method: 'POST',
      data: card,
      auth: true,
    });
  }

  static async updateCard(card) {
    return HttpService.request({
      url: `${config.cardPath}/${card.id}`,
      method: 'PUT',
      data: card,
      auth: true,
    });
  }

  static async deleteCard(id) {
    return HttpService.request({
      url: `${config.cardPath}/${id}`,
      method: 'DELETE',
      auth: true,
    });
  }

  static async getStatuses() {
    return HttpService.request({
      url: config.statusesPath,
      auth: true,
    });
  }
}
