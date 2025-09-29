import dayjs from 'dayjs';

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'minute');
}

export { isDatesEqual };
