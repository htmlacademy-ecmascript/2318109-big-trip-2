import PointPresenter from './presenter/point-presenter.js';
const filterContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');

const pointPresenter = new PointPresenter({
  filterContainer: filterContainer,
  contentContainer: contentContainer
});

pointPresenter.init();
