import { DATE_FORMAT } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';
import { getDurationDate, humanizePointDueDate } from '../utils.js';

function createPointTemplate (point, offers, destinations) {
  const {basePrice, dateFrom, dateTo, isFavorite, type} = point;
  const offersType = offers.find((item) => item.type === point.type).offers;
  const pointOffers = offersType.filter((offerType) => point.offers.includes(offerType.id));
  const pointDestination = destinations.find((item) => item.id === point.destination);

  return (`<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${humanizePointDueDate(dateFrom, DATE_FORMAT.DATE)}">${humanizePointDueDate(dateFrom, DATE_FORMAT.MONTHDAY)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${pointDestination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${humanizePointDueDate(dateFrom, DATE_FORMAT.FULL_DATETIME)}">${humanizePointDueDate(dateFrom, DATE_FORMAT.TIME)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${humanizePointDueDate(dateTo, DATE_FORMAT.FULL_DATETIME)}">${humanizePointDueDate(dateTo, DATE_FORMAT.TIME)}</time>
                  </p>
                  <p class="event__duration">${getDurationDate(dateFrom, dateTo)}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                ${pointOffers.map((pointOffer) => (
      `<li class="event__offer">
                    <span class="event__offer-title">${pointOffer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${pointOffer.price}</span>
                  </li>`
    )).join('')}
                </ul>
                <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : '' }" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`);
}

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #onButtonClick = null;

  constructor ({point, offers, destinations, onButtonClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onButtonClick = onButtonClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onButtonClick();
  };
}
