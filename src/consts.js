const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const DayFormat = {
  DATE: 'YYYY-MM-DD',
  FULL_DATETIME: 'YYYY-MM-DDTHH:mm',
  TIME: 'HH:mm',
  MONTHDAY: 'MMM D',
  DATETIME: 'DD/MM/YY HH:mm',
  TRIP: 'D MMM'
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

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

const NoPointsMessagesType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};

const DEFAULT_POINT = ({
  basePrice: '0',
  dateFrom: null,
  dateTo: null,
  destination: null,
  offers: [],
  type: 'flight',
  isFavorite: false,
});

const DISPLAYED_DESTINATION_COUNT = 3;

const DEFAULT_PRICE = 0;

const DISABLED_SORT_TYPE = [SortType.EVENT, SortType.OFFERS];

export { DISPLAYED_DESTINATION_COUNT, DEFAULT_PRICE, DEFAULT_POINT, DayFormat, PointTypes, EditType, FilterType, MODE, SortType, DISABLED_SORT_TYPE, UserAction, UpdateType, NoPointsMessagesType };
