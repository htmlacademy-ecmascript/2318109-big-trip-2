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

const EVENT_TYPES = [
  { eventType: 'taxi',
    eventLabel: 'Taxi'
  },
  {
    eventType: 'bus',
    eventLabel: 'Bus'
  },
  {
    eventType: 'train',
    eventLabel: 'Train'
  },
  {
    eventType: 'ship',
    eventLabel: 'Ship'
  },
  {
    eventType: 'drive',
    eventLabel: 'Drive'
  },
  {
    eventType: 'flight',
    eventLabel: 'Flight'
  },
  {
    eventType: 'check-in',
    eventLabel: 'Check-in'
  },
  { eventType: 'sightseeing',
    eventLabel: 'Sightseeing'
  },
  { eventType: 'restaurant',
    eventLabel: 'Restaurant'
  }
];

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export { POINTS_COUNT, DATE_FORMAT, EVENT_TYPES, FILTER_TYPE, MODE };
