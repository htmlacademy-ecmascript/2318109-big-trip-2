import NoPointView from '../view/no-point-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointPresenter from './point-presenter.js';
import LoadingView from '../view/loading-view.js';
import FailedLoadView from '../view/failed-load-view.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortByPrice, sortByTime, sortByDay } from '../utils/sort.js';
import { SortType, UserAction, UpdateType, FilterType } from '../consts.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { filter } from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class Presenter {
  #contentContainer = null;

  #filterModel = null;
  #pointsModel = null;

  #failedLoadComponent = new FailedLoadView();
  #loadingComponent = new LoadingView();
  #eventListComponent = new EventListView();
  #noPointComponent = null;
  #sortComponent = null;

  #pointPresenters = new Map();
  #newPointBtnPresenter = null;
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isCreating = false;
  #isLoading = true;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({contentContainer, pointsModel, filterModel, newPointBtnPresenter}) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointBtnPresenter = newPointBtnPresenter;

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#render();
  }

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clear();
        this.#render();
        break;
      case UpdateType.MAJOR:
        this.#clear({ resetSortType: true });
        this.#render();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#render();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clear();
        this.#renderError();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderError() {
    render(this.#failedLoadComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clear();
    this.#render();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#sortTypeChangeHandler,
      currentSortType: this.#currentSortType
    });

    render(this.#sortComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNewPointPresenter() {
    this.#newPointPresenter = new NewPointPresenter({
      contentContainer: this.#eventListComponent.element,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler,
      pointsModel: this.#pointsModel
    });

    this.#newPointPresenter.init();
  }

  newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointBtnPresenter.disableButton();

    this.#renderNewPointPresenter();
  };

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    this.#newPointBtnPresenter.enableButton();
    if (this.points.length === 0) {
      this.#clear();
      this.#render();
    }
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      contentContainer: this.#eventListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#eventListComponent.element);
  }

  #clear({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#failedLoadComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    if(this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
  };

  #render() {
    render(this.#eventListComponent, this.#contentContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0 && !this.#isCreating) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints(points.slice(0, pointCount));
  }
}
