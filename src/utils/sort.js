import dayjs from 'dayjs';

const getPointDuration = (point) => dayjs(point.dateTo).diff(dayjs(point.dateFrom));

const sortByTime = (pointA, pointB) => {
  const pointDurationA = getPointDuration(pointA);
  const pointDurationB = getPointDuration(pointB);

  return pointDurationB - pointDurationA;
};

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));


export { sortByPrice, sortByTime, sortByDay };
