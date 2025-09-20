import NoPointView from '../view/no-point-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { render } from '../framework/render.js';
import { generateFilter } from '../../mock/filters.js';

export default class Presenter {
  #filterContainer = null;
  #contentContainer = null;

  #pointsModel = null;

  #points = [];

  #noPointComponent = new NoPointView();
  #sortCompanent = new SortView();

  #pointPresenters = new Map();

  constructor({filterContainer, contentContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    this.#render();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderFilters() {
    const filters = generateFilter(this.#points);
    render(new FilterView({filters}), this.#filterContainer);
  }

  #renderSort() {
    render(this.#sortCompanent, this.#contentContainer);
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

