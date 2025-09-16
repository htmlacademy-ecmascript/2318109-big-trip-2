import dayjs from 'dayjs';

const humanizePointDueDate = (dueDate, dateFormat) => dueDate ? dayjs(dueDate).format(dateFormat) : '';

const getDurationDate = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);

  const diffMs = end.diff(start);

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  const pad2 = (num) => String(num).padStart(2, '0');

  if (days >= 1) {
    return `${days}D ${(hours ? `${pad2(hours)}H` : '')} ${ minutes ? ` ${pad2(minutes)}M` : ''}`;
  } else if (totalHours >= 1) {
    return `${pad2(totalHours)}H ${minutes ? `${pad2(minutes)}M` : '00M'}`;
  } else {
    return `${totalMinutes}M`;
  }
};

function isPointPast(dateFrom) {
  return dateFrom && dayjs(dateFrom).isBefore(dayjs(), 'minute');
}

function isPointPresent(dateFrom) {
  return dateFrom && dayjs(dateFrom).isSame(dayjs(), 'day') && dayjs(dateFrom).isAfter(dayjs().startOf('day'));
}

function isPointFuture(dateFrom) {
  return dateFrom && dayjs(dateFrom).isAfter(dayjs(), 'minute');
}

export { humanizePointDueDate, getDurationDate, isPointFuture, isPointPresent, isPointPast };
