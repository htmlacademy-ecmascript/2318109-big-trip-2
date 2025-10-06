import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsMessagesType } from '../consts.js';

function createNoPointTemplate(filterType) {
  const noPointsMessageValue = NoPointsMessagesType[filterType];

  return (`
    <p class="trip-events__msg">
      ${noPointsMessageValue}
    </p>
  `);
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }

}
