import { POINTS_COUNT } from '../consts.js';
import { getRandomPoint } from '../../mock/points.js';
import { Descriptions } from '../../mock/descriptions';
import { Offers } from '../../mock/offers';

export default class PointsModel {
  points = Array.from({length: POINTS_COUNT}, getRandomPoint);
  descriptions = Descriptions;
  offers = Offers;

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDescriptions() {
    return this.descriptions;
  }
}

