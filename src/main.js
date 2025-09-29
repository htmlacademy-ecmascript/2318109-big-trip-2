import FilterPresenter from './presenter/filter-presenter.js';
import NewPointBtnPresenter from './presenter/new-point-btn-presenter.js';
import Presenter from './presenter/presenter.js';
import PointsModel from './model/model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic ivtai117ahtwbnp121';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const init = () => {
  const filterContainer = document.querySelector('.trip-controls__filters');
  const contentContainer = document.querySelector('.trip-events');
  const tripMainContainer = document.querySelector('.trip-main');

  const pointsModel = new PointsModel({
    pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
  });

  const filterModel = new FilterModel();

  const newPointBtnPresenter = new NewPointBtnPresenter({
    tripMainContainer: tripMainContainer
  });

  const filterPresenter = new FilterPresenter({
    filterContainer: filterContainer,
    filterModel,
    pointsModel
  });

  const pointPresenter = new Presenter({
    contentContainer: contentContainer,
    tripMainContainer: tripMainContainer,
    pointsModel,
    filterModel,
    newPointBtnPresenter
  });

  filterPresenter.init();
  pointPresenter.init();
  pointsModel.init()
    .finally(() => {
      newPointBtnPresenter.init({onButtonClick: pointPresenter.newPointButtonClickHandler});
    });
};

init();
