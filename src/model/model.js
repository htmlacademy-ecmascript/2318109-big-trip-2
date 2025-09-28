import { POINTS_COUNT } from '../consts.js';
import { getRandomPoint } from '../../mock/points.js';
import { Destinations } from '../../mock/destinations.js';
import { Offers } from '../../mock/offers';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = this.generateUniquePoints();
  #destinations = Destinations;
  #offers = Offers;

  generateUniquePoints() {
    const uniqueIds = new Set();
    const points = [];

    while (points.length < POINTS_COUNT) {
      const mockPoint = getRandomPoint();
      if (!uniqueIds.has(mockPoint.id)) {
        uniqueIds.add(mockPoint.id);
        points.push(mockPoint);
      }
    }

    return points;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type);
  }
}
