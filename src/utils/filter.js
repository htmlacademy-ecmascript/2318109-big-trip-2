import { FILTER_TYPE } from '../consts.js';
import dayjs from 'dayjs';

function isPointPast(dateFrom) {
  return dateFrom && dayjs(dateFrom).isBefore(dayjs(), 'minute');
}

function isPointPresent(dateFrom) {
  return dateFrom && dayjs(dateFrom).isBefore(dayjs(), 'minute') || dayjs(dateFrom).isSame(dayjs(), 'day') && dayjs(dateFrom).isAfter(dayjs().startOf('day'));
}

function isPointFuture(dateFrom) {
  return dateFrom && dayjs(dateFrom).isAfter(dayjs(), 'minute');
}

const filter = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPointPast(point.dateFrom)),
  [FILTER_TYPE.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom)),
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
};

export { filter };
