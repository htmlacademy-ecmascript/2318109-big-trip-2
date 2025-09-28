import FilterPresenter from './presenter/filter-presenter.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/model.js';
import FilterModel from './model/filter-model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel;
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel
});

const pointPresenter = new Presenter({
  contentContainer: contentContainer,
  pointsModel,
  filterModel
});

filterPresenter.init();
pointPresenter.init();
