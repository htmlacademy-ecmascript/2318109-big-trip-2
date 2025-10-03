import PointFormView from '../view/point-form-view.js';
import PointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { MODE } from '../consts.js';
import { UserAction, UpdateType } from '../consts.js';
import { isDatesEqual} from '../utils/common.js';

export default class PointPresenter {
  #offers = [];
  #destinations = [];
  #destination = null;
  #offersByType = [];
  #point = null;

  #contentContainer = null;

  #pointsModel = null;

  #dataChangeHandler = null;
  #modeChangeHandler = null;

  #pointComponent = null;
  #editPointComponent = null;

  #mode = MODE.DEFAULT;

  constructor({contentContainer, pointsModel, onDataChange, onModeChange }) {
    this.#contentContainer = contentContainer;
    this.#pointsModel = pointsModel;
    this.#dataChangeHandler = onDataChange;
    this.#modeChangeHandler = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#offers = [...this.#pointsModel.offers];
    this.#offersByType = this.#pointsModel.getOffersByType(this.#point.type);
    this.#destinations = [...this.#pointsModel.destinations];
    this.#destination = this.#pointsModel.getDestinationById(this.#point.destination);

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offersByType: this.#offersByType,
      destination: this.#destination,
      onButtonClick: this.#buttonClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#editPointComponent = new PointFormView({
      point: this.#point,
      offers: this.#offers,
      offersByType: this.#offersByType,
      destinations: this.#destinations,
      destination: this.#destination,
      onButtonClick: this.#buttonClickHandler,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#contentContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#pointComponent, prevEditPointComponent);
      this.#mode = MODE.DEFAULT;
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

  setSaving() {
    if (this.#mode === MODE.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === MODE.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #replacePointToEditForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#modeChangeHandler();
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

  #buttonClickHandler = (isClose = false) => {
    if(isClose) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
      return;
    }

    this.#replacePointToEditForm();
  };

  #favoriteClickHandler = () => {
    this.#dataChangeHandler(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #formSubmitHandler = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this.#point.dateTo, update.dateTo);

    this.#dataChangeHandler(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
  };

  #deleteClickHandler = (point) => {
    this.#dataChangeHandler(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
