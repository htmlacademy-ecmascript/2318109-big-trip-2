import AbstractView from '../framework/view/abstract-view.js';

function createNewPointBtnTemplate () {
  return `
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
    New event
  </button>
  `;
}

export default class NewPointBtnView extends AbstractView {
  #onButtonClick = null;

  constructor({onButtonClick}) {
    super();
    this.#onButtonClick = onButtonClick;

    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createNewPointBtnTemplate();
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onButtonClick();
  };
}

