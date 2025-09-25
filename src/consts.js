const POINTS_COUNT = 4;

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  FULL_DATETIME: 'YYYY-MM-DDTHH:mm',
  TIME: 'HH:mm',
  MONTHDAY: 'MMM D',
  DATETIME: 'DD/MM/YY HH:mm'
};

const PointTypes = [
  { pointType: 'taxi',
    pointLabel: 'Taxi'
  },
  {
    pointType: 'bus',
    pointLabel: 'Bus'
  },
  {
    pointType: 'train',
    pointLabel: 'Train'
  },
  {
    pointType: 'ship',
    pointLabel: 'Ship'
  },
  {
    pointType: 'drive',
    pointLabel: 'Drive'
  },
  {
    pointType: 'flight',
    pointLabel: 'Flight'
  },
  {
    pointType: 'check-in',
    pointLabel: 'Check-in'
  },
  { pointType: 'sightseeing',
    pointLabel: 'Sightseeing'
  },
  { pointType: 'restaurant',
    pointLabel: 'Restaurant'
  }
];

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SORT_TYPE = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const DISABLED_SORT_TYPE = [SORT_TYPE.EVENT, SORT_TYPE.OFFERS];

export { POINTS_COUNT, DATE_FORMAT, PointTypes, FILTER_TYPE, MODE, SORT_TYPE, DISABLED_SORT_TYPE };
