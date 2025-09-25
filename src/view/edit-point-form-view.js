import { DATE_FORMAT, PointTypes } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDueDate } from '../utils/date-format.js';

function createEditPointFormTemplate (point, offers, destinations) {
  const {basePrice, dateFrom, dateTo, type, id} = point;
  const pointDestination = destinations.find((destination) => destination.id === point.destination);

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
                        ${createPointTypeTemplate(type, id)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-${id}">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-${id}">
                  ${createDestinationsListTemplate(destinations)}
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
                      ${createOffersTemplate(point, offers)}
                  </section>
                  <section class="event__section  event__section--destination">
                    ${createDestinationTemplate(pointDestination)}
                  </section>
                </section>
              </form>
            </li>`);
}

function createDestinationsListTemplate (destinations, id) {
  return (`
    <datalist id="destination-list-${id}">
      ${destinations.map (({name}) =>
      `<option value="${name}"></option>`
    ).join('')}
    </datalist>
  `);
}

function createPointTypeTemplate (currentType , id) {
  return (`
    ${PointTypes.map(({pointType, pointLabel}) =>
      `<div class="event__type-item">
          <input id="event-type-${pointType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === currentType ? 'checked' : ''}>
          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${id}">${pointLabel}</label>
        </div>`
    ).join('')}
  `);
}

function createDestinationTemplate (pointDestination) {
  return (`
    ${pointDestination.description ? `
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>` : ''}
        ${pointDestination.pictures?.length ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pointDestination.pictures.map(({src, description}) =>
      `<img class="event__photo" src="${src}" alt="${description}">`
    ).join('')}
        </div>
      </div>` : ''}
  `);
}

function createOffersTemplate (point, offers) {
  const offersByType = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = offersByType.filter((offer) => point.offers.includes(offer.id));

  return (`
    ${pointOffers ? `
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${pointOffers.map(({id, title, price}) =>
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${id}-${point.id}" type="checkbox" name="${title}">
          <label class="event__offer-label" for="${id}-${point.id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`
    ).join('')}
      </div>` : ''}
  `);
}

export default class EditPointFormView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #onButtonClick = null;
  #onFormSubmit = null;

  constructor ({point, offers, destinations, onButtonClick, onFormSubmit}) {
    super();
    this._setState(EditPointFormView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onButtonClick = onButtonClick;
    this.#onFormSubmit = onFormSubmit;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditPointFormTemplate(this._state, this.#offers, this.#destinations);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onButtonClick(EditPointFormView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditPointFormView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return { ...state };
  }

}
