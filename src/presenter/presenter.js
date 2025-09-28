import NoPointView from '../view/no-point-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import { sortByPrice, sortByTime } from '../utils/sort.js';
import { SortType } from '../consts.js';
import { render } from '../framework/render.js';
import { generateFilter } from '../../mock/filters.js';

export default class Presenter {
  #filterContainer = null;
  #contentContainer = null;

  #pointsModel = null;

  #noPointComponent = new NoPointView();
  #sortCompanent = null;

  #pointPresenters = new Map();

  #currentSortType = SortType.DAY;

  constructor({filterContainer, contentContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      // case SortType.DAY:
      //   return [...this.#pointsModel.points].sort(sortByDay);
      case SortType.DAY:
        return [...this.#pointsModel.points];
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }

    return this.#pointsModel.points;
  }

  init() {
    this.#render();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPresenter();
    this.#renderPoints();
  };

  #renderSort() {
    this.#sortCompanent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    render(this.#sortCompanent, this.#contentContainer);
  }

  #renderFilters() {
    const filters = generateFilter(this.points);
    render(new FilterView({filters}), this.#filterContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      contentContainer: this.#contentContainer,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#contentContainer);
  }

  #clearPresenter() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #render() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
    this.#renderFilters();
  }
}
