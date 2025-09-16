import { FILTER_TYPE } from '../const.js';
import { isPointPast, isPointPresent, isPointFuture } from './utils.js';

const filter = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPointPast(point.dateFrom)),
  [FILTER_TYPE.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom)),
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
};

export { filter };
