import Presenter from './presenter/presenter.js';
import PointsModel from './model/model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');


const pointsModel = new PointsModel;
const pointPresenter = new Presenter({
  filterContainer: filterContainer,
  contentContainer: contentContainer,
  pointsModel
});

pointPresenter.init();
