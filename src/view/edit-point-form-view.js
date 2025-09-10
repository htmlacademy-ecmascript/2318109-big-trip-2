import { DATE_FORMAT, EVENT_TYPES } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate } from '../utils.js';

function createEditPointFormTemplate (point, offers, destinations) {
  const {basePrice, dateFrom, dateTo, type, id} = point;
  const offersType = offers.find((item) => item.type === point.type).offers;
  const pointOffers = offersType.filter((offerType) => point.offers.includes(offerType.id));
  const pointDestination = destinations.find((item) => item.id === point.destination);
  return (`<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${EVENT_TYPES.map(({eventType, eventLabel}) =>
      `<div class="event__type-item">
                        <input id="event-type-${eventType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
                        <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventLabel}</label>
                      </div>`)
      .join('')}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-${id}">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-${id}">
                  <datalist id="destination-list-${id}">
                  ${destinations.map ((destination) =>
      `<option value="${destination.name}"></option>`
    ).join('')}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${id}">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizePointDueDate(dateFrom, DATE_FORMAT.DATETIME)}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-${id}">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizePointDueDate(dateTo, DATE_FORMAT.DATETIME)}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-${id}">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                      ${pointOffers.map((offerItem) =>
      `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="${offerItem.title}-${id}" type="checkbox" name="${offerItem.title}">
                        <label class="event__offer-label" for="${offerItem.title}-${id}">
                          <span class="event__offer-title">${offerItem.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offerItem.price}</span>
                        </label>
                      </div>`
    ).join('')}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${pointDestination.description}</p>
                  </section>
                </section>
              </form>
            </li>`);
}

export default class EditPointFormView extends AbstractView {
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
    return createEditPointFormTemplate(this.#point, this.#offers, this.#destinations);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onButtonClick();
  };
}
