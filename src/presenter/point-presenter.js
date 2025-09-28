import EditPointFormView from '../view/edit-point-form-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { MODE } from '../consts.js';

export default class PointPresenter {
  #offers = [];
  #destinations = [];
  #destination = [];

  #contentContainer = null;

  #point = null;
  #pointsModel = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #editPointComponent = null;

  #mode = MODE.DEFAULT;

  constructor({contentContainer, pointsModel, onDataChange, onModeChange }) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#offers = this.#pointsModel.getOffersByType(this.#point.type);
    this.#destinations = [...this.#pointsModel.destinations];
    this.#destination = this.#pointsModel.getDestinationById(this.#point.destination);

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onButtonClick: () => this.#replacePointToEditForm(),
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editPointComponent = new EditPointFormView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      destination: this.#destination,
      onButtonClick: () => this.#replaceEditFormToPoint(),
      onFormSubmit: this.#formSubmitHandler,
      pointsModel: this.#pointsModel
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#contentContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView() {
    if (this.#mode !== MODE.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = MODE.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(point);
    this.#replaceEditFormToPoint();
  };
}

