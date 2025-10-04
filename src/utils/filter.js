import { FilterType } from '../consts.js';
import dayjs from 'dayjs';

const isPointPast = (dateTo) => dateTo && dayjs(dateTo).isBefore(dayjs(), 'minute');

const isPointPresent = (dateFrom, dateTo) => dateFrom && dateTo && (dayjs(dateFrom).isBefore(dayjs(), 'minute') || dayjs(dateFrom).isSame(dayjs(), 'day')) && dayjs(dateTo).isAfter(dayjs(), 'minute');

const isPointFuture = (dateFrom) => dateFrom && dayjs(dateFrom).isAfter(dayjs(), 'minute');

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateTo)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point.dateFrom, point.dateTo)),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
};

export { filter };
