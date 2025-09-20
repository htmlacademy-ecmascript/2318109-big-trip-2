import { getRandomArrayElement } from '../src/utils/common.js';

const Points = [
  {
    id: 'f5b62099-293f-1c3d-a702-94eec4a2808c',
    basePrice: 1500,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    isFavorite: true,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b1c3e0e6-9553-42ce-b947-e281314baa31',
      'b0c2e4e6-9053-49ce-b747-e281314baa36'
    ],
    type: 'taxi'
  },

  {
    id: 'f4b62079-293f-4c3d-a702-94eec9a2808c',
    basePrice: 1100,
    dateFrom: '2026-07-10T20:55:56.845Z',
    dateTo: '2026-07-11T11:21:13.375Z',
    destination: 'cfe416cq-10xa-ye10-9077-5fs9a01edcab',
    isFavorite: false,
    offers: [
      'b8c3e4e6-9453-42ce-b747-e287314baa31',
      'b7c3e4e6-8453-43ce-b747-e287014baa31'
    ],
    type: 'ship'
  },

  {
    id: 'f4b62099-203f-4c3d-a702-96eec4a2808c',
    basePrice: 1340,
    dateFrom: '2025-08-15T15:45:56.845Z',
    dateTo: '2026-08-15T11:23:13.375Z',
    destination: 'cfe416cq-10xa-ye40-8077-2fs9a03edcab',
    isFavorite: false,
    offers: [
      'b1c3e4e6-9053-62ce-b747-e581314baa31',
      'b9c3e4e6-9953-62ce-b547-e582314baa34',
      'b6c3e0e6-9053-52ce-b747-e581334baa31'
    ],
    type: 'flight'
  },

  {
    id: 'f4b62099-253f-4c3d-a712-96eec3a2800c',
    basePrice: 1086,
    dateFrom: '2021-04-10T22:45:56.845Z',
    dateTo: '2021-04-11T15:10:43.375Z',
    destination: 'cfe662cq-17xa-ye40-8077-2fs9a03edcab',
    isFavorite: true,
    offers: ['b7c2e0e6-9053-51ce-b737-e581334baa81'],
    type: 'train'
  },
];

const getRandomPoint = () => getRandomArrayElement(Points);

export { getRandomPoint };
