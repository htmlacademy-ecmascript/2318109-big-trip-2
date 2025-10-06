import NewPointBtnView from '../view/new-point-btn-view.js';
import { render } from '../framework/render.js';

export default class NewPointBtnPresenter {
  #tripMainContainer = null;

  #handleButtonClick = null;

  #newPointBtnComponent = null;

  constructor({tripMainContainer}) {
    this.#tripMainContainer = tripMainContainer;
  }

  init({onButtonClick}) {
    this.#handleButtonClick = onButtonClick;
    this.#newPointBtnComponent = new NewPointBtnView({
      onButtonClick: this.#buttonClickHandler
    });

    render(this.#newPointBtnComponent, this.#tripMainContainer);
  }

  disableButton() {
    this.#newPointBtnComponent.setDisabled(true);
  }

  enableButton() {
    this.#newPointBtnComponent.setDisabled(false);
  }

  #buttonClickHandler = () => {
    this.#handleButtonClick();
  };

}
