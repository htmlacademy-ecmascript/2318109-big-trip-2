import AbstractView from '../framework/view/abstract-view';
import { DEFAULT_PRICE } from '../consts.js';

function createHeaderTemplate(route, duration, totalPrice) {
  return (`
  <section class="trip-main__trip-info trip-info">
    <div class="trip-info__main">
      ${route ?
      `<h1 class="trip-info__title">${route}</h1>`
      : ''}

      ${duration ?
      `<p class="trip-info__dates">${duration}</p>`
      : ''}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice || DEFAULT_PRICE}</span>
    </p>
  </section>
  `);
}

export default class HeaderView extends AbstractView{
  #route = null;
  #duration = null;
  #totalPrice = DEFAULT_PRICE;

  constructor({ route, duration, totalPrice }) {
    super();
    this.#route = route;
    this.#duration = duration;
    this.#totalPrice = totalPrice;
  }

  get template() {
    return createHeaderTemplate(this.#route, this.#duration, this.#totalPrice);
  }
}
