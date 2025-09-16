import { filter } from '../utils/filter.js';

const generateFilter = (points) => Object.entries(filter).map(
  ([filterType, filterPoint]) => ({
    type: filterType,
    count: filterPoint(points).length,
  }),
);

export { generateFilter };
