import FilterPresenter from './presenter/filter-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/model.js';
import FilterModel from './model/filter-model.js';

const init = () => {
  const filterContainer = document.querySelector('.trip-controls__filters');
  const contentContainer = document.querySelector('.trip-events');
  const tripMainContainer = document.querySelector('.trip-main');

  const pointsModel = new PointsModel();
  const filterModel = new FilterModel();

  const filterPresenter = new FilterPresenter({
    filterContainer: filterContainer,
    filterModel,
    pointsModel
  });

  const pointPresenter = new Presenter({
    contentContainer: contentContainer,
    tripMainContainer: tripMainContainer,
    pointsModel,
    filterModel
  });

  const headerPresenter = new HeaderPresenter({
    tripMainContainer: tripMainContainer,
  });

  headerPresenter.init();
  filterPresenter.init();
  pointPresenter.init();
};

init();
