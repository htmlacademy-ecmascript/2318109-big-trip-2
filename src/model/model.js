import { POINTS_COUNT } from '../consts.js';
import { getRandomPoint } from '../../mock/points.js';
import { Destinations } from '../../mock/destinations.js';
import { Offers } from '../../mock/offers';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = this.generateUniquePoints();
  #destinations = Destinations;
  #offers = Offers;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {

    });
  }

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

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

}
