import { FilterType } from '../consts.js';
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
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
};

export { filter };
