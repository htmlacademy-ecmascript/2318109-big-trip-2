import NoPointView from '../view/no-point-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import AddPointFormView from '../view/add-point-form-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import PointView from '../view/point-view.js';
import { render, replace } from '../framework/render.js';
import { generateFilter } from './mock/filters.js';

export default class Presenter {
  #filterContainer = null;
  #contentContainer = null;
  #pointsModel = null;

  #points = [];
  #offers = [];
  #destinations = [];

  #sortCompanent = new SortView();

  constructor({filterContainer, contentContainer, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#offers = [...this.#pointsModel.offers];
    this.#destinations = [...this.#pointsModel.destinations];

    this.#render();
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const offers = this.#offers;
    const destinations = this.#destinations;
    const pointComponent = new PointView({
      point,
      offers,
      destinations,
      onButtonClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointComponent = new EditPointFormView({
      point,
      offers,
      destinations,
      onFormSubmit: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onButtonClick: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToEditForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, editPointComponent);
    }

    render(pointComponent, this.#contentContainer);
  }

  #render() {
    const filters = generateFilter(this.#points);

    render(new FilterView({filters}), this.#filterContainer);
    render(this.#sortCompanent, this.#contentContainer);
    render(new AddPointFormView({point: this.#points[1],
      offers: this.#offers,
      destinations: this.#destinations
    }),this.#contentContainer);

    if (this.#points.length === 0) {
      render(new NoPointView(), this.#contentContainer);
      return;
    }

    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }
}

