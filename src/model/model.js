import { POINTS_COUNT } from '../consts.js';
import { getRandomPoint } from '../../mock/points.js';
import { Destinations } from '../../mock/destinations.js';
import { Offers } from '../../mock/offers';

export default class PointsModel {
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
}
