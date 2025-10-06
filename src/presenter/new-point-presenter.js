import PointFormView from '../view/point-form-view.js';
import { UserAction, UpdateType, DEFAULT_POINT, EditType } from '../consts.js';
import { remove, render, RenderPosition } from '../framework/render.js';

export default class NewPointPresenter {
  #eventListContainer = null;

  #handleDataChange = null;
  #handleDestroy = null;

  #addPointComponent = null;

  #pointsModel = null;

  constructor({ contentContainer, pointsModel, onDataChange, onDestroy }) {
    this.#eventListContainer = contentContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

    this.#pointsModel = pointsModel;
  }

  init() {
    if (this.#addPointComponent !== null) {
      return;
    }

    this.#addPointComponent = new PointFormView({
      point: DEFAULT_POINT,
      offers: [...this.#pointsModel.offers],
      offersByType: this.#pointsModel.getOffersByType('flight'),
      pointsModel: this.#pointsModel,
      destinations: [...this.#pointsModel.destinations],
      onCancelClick: this.#cancelClickHandler,
      onFormSubmit: this.#formSubmitHandler,
      type: EditType.CREATING,
    });

    render(this.#addPointComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#addPointComponent) {
      return;
    }

    remove(this.#addPointComponent);
    this.#addPointComponent = null;
    this.#handleDestroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#addPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #cancelClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setAborting() {
    const resetFormState = () => {
      this.#addPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#addPointComponent.shake(resetFormState);
  }
}
