import { DATE_FORMAT, PointTypes } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDueDate } from '../utils/date-format.js';

function createEditPointFormTemplate (point, offers, destinations, destination) {
  const {basePrice, dateFrom, dateTo, type, id} = point;

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
                        ${createPointTypeTemplate(type)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
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
                    ${createDestinationTemplate(destination)}
                  </section>
                </section>
              </form>
            </li>`);
}

function createDestinationsListTemplate (destinations) {
  return (`
    <datalist id="destination-list-1">
      ${destinations.map (({name}) =>
      `<option value="${name}"></option>`
    ).join('')}
    </datalist>
  `);
}

function createPointTypeTemplate (currentType) {
  return (`
    ${PointTypes.map(({pointType, pointLabel}) =>
      `<div class="event__type-item">
          <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === currentType ? 'checked' : ''}>
          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointLabel}</label>
        </div>`
    ).join('')}
  `);
}

function createDestinationTemplate (destination) {
  return (`
    ${destination.description ? `
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>` : ''}
        ${destination.pictures?.length ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map(({src, description}) =>
      `<img class="event__photo" src="${src}" alt="${description}">`
    ).join('')}
        </div>
      </div>` : ''}
  `);
}

function createOffersTemplate (point, offersList) {
  return (`
    ${offersList.length !== 0 ? `
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersList.offers.map(({id, title, price}) =>
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
  #destination = null;
  #offers = null;
  #onButtonClick = null;
  #onFormSubmit = null;
  #pointsModel = null;

  constructor ({point, offers, destinations, destination, onButtonClick, onFormSubmit, pointsModel}) {
    super();
    this._setState(EditPointFormView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#destination = destination;
    this.#onButtonClick = onButtonClick;
    this.#onFormSubmit = onFormSubmit;
    this.#pointsModel = pointsModel;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointFormTemplate(this._state, this.#offers, this.#destinations, this.#destination);
  }

  reset(point) {
    this.updateElement(EditPointFormView.parsePointToState(point));
  }

  _restoreHandlers () {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedType = evt.target.value;

    const newOffers = this.#pointsModel.getOffersByType(selectedType);

    this._setState({
      ...this._state,
      type: selectedType,
      offers: newOffers
    });

    this.#offers = newOffers;

    this.updateElement({
      type: selectedType,
      offers: this.#offers
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const selectedDestinationName = evt.target.value;

    const destinations = this.#pointsModel.destinations;
    const newDestination = destinations.find(
      (dest) => dest.name === selectedDestinationName
    );

    if (newDestination) {
      this.#destination = newDestination;
      this._setState({
        ...this._state,
        destination: newDestination.id
      });

      this.updateElement({
        destination: newDestination.id
      });
    }
  };

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
