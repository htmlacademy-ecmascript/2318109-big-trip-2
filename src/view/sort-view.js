import AbstractView from '../framework/view/abstract-view.js';
import { SortType, DISABLED_SORT_TYPE } from '../consts.js';

function createSortItemTemplate (sortType, currentSortType) {
  const sortName = sortType.at(0).toUpperCase() + sortType.slice(1);
  const isDisabled = DISABLED_SORT_TYPE.includes(sortType) ? 'disabled' : '';
  const isChecked = sortType === currentSortType ? 'checked' : '';

  return `<div class="trip-sort__item  trip-sort__item--${sortType}">
            <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" data-sort-type="${sortType}" ${isChecked} ${isDisabled}>
            <label class="trip-sort__btn" for="sort-${sortType}">${sortName}</label>
          </div>`;
}

function createSortTemplate (currentSortType) {
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
     ${Object.values(SortType).map((sortType) => createSortItemTemplate(sortType, currentSortType)
    ).join('')}
          </form>`);
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ onSortTypeChange, currentSortType }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    const sortInput = this.element.querySelectorAll('.trip-sort__input');
    sortInput.forEach((item) => {
      item.addEventListener('change', this.#sortTypeChangeHandler);
    });
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

}
