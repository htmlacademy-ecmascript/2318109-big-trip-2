import NoPointView from '../view/no-point-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortByPrice, sortByTime } from '../utils/sort.js';
import { SORT_TYPE } from '../consts.js';
import { render } from '../framework/render.js';
import { generateFilter } from '../../mock/filters.js';

export default class Presenter {
  #filterContainer = null;
  #contentContainer = null;

  #pointsModel = null;

  #points = [];
  #sourcedPoints = [];

  #noPointComponent = new NoPointView();
  #sortCompanent = null;

  #pointPresenters = new Map();

  #currentSortType = SORT_TYPE.DAY;

  constructor({filterContainer, contentContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#sourcedPoints = [...this.#pointsModel.points];

    this.#render();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SORT_TYPE.TIME:
        this.#points.sort(sortByTime);
        break;
      case SORT_TYPE.PRICE:
        this.#points.sort(sortByPrice);
        break;
      case SORT_TYPE.DAY:
        this.#points = [...this.#sourcedPoints];
        break;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
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
    const filters = generateFilter(this.#points);
    render(new FilterView({filters}), this.#filterContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      contentContainer: this.#contentContainer,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(from, to) {
    this.#points
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#contentContainer);
  }

  #clearPresenter() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #render() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
    this.#renderFilters();
  }
}

