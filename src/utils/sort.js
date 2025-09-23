import dayjs from 'dayjs';

const getPointDuration = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

function sortByTime (pointA, pointB) {
  const pointDurationA = getPointDuration(pointA);
  const pointDurationB = getPointDuration(pointB);

  return pointDurationB - pointDurationA;
}

function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export { sortByPrice, sortByTime };
