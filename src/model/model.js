import { POINTS_COUNT } from '../consts.js';
import { getRandomPoint } from '../../mock/points.js';
import { Destinations } from '../../mock/destinations.js';
import { Offers } from '../../mock/offers';

export default class PointsModel {
  #points = Array.from({length: POINTS_COUNT}, getRandomPoint);
  #destinations = Destinations;
  #offers = Offers;

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
