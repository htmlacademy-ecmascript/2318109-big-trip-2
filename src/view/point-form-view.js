import { DATE_FORMAT, PointTypes } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDueDate } from '../utils/date-format.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEditPointFormTemplate (state, offersbyType, destinations, destination) {
  const { dateFrom, dateTo, selectedOffers, type, basePrice} = state;
  const offersList = offersbyType.offers;

  return (`
    <li class="trip-events__item">
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
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1" required>
                  ${createDestinationsListTemplate(destinations)}
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDueDate(dateFrom, DATE_FORMAT.DATETIME)}" >
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDueDate(dateTo, DATE_FORMAT.DATETIME)}" >
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(basePrice))}" required>
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                      ${createOffersTemplate(selectedOffers, offersList)}
                  </section>
                  <section class="event__section  event__section--destination">
                    ${createDestinationTemplate(destination)}
                  </section>
                </section>
              </form>
            </li>
          `);
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

function createOffersTemplate (selectedOffers, offersList) {
  return (`
    ${offersList.length !== 0 ? `
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersList.map(({id, title, price}) => {
      const isChecked = selectedOffers.includes(id) ? 'checked' : '';
      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="${title}" data-offer-id=${id} ${isChecked}}>
          <label class="event__offer-label" for="event-offer-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`;
    }).join('')}
      </div>` : ''}
  `);
}

export default class PointFormView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;
  #destinations = null;
  #destination = null;
  #offers = null;
  #onButtonClick = null;
  #onFormSubmit = null;
  #pointsModel = null;
  #handleDeleteClick = null;

  constructor ({point, offers, destinations, destination, onButtonClick, onFormSubmit, pointsModel, onDeleteClick}) {
    super();
    this._setState(PointFormView.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#destination = destination;
    this.#onButtonClick = onButtonClick;
    this.#onFormSubmit = onFormSubmit;
    this.#pointsModel = pointsModel;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointFormTemplate(this._state, this.#offers, this.#destinations, this.#destination);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(PointFormView.parsePointToState(point));
  }

  _restoreHandlers () {
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);

    this.#setDatepickers();
  }

  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    const options = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locate: {firstDayOfWeek: 1},
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...options,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo
      }
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...options,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom
      }
    );
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateFrom: userDate});
    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({...this._state, dateTo: userDate});
    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #priceInputHandler = (evt) => {
    this._setState({
      basePrice: parseInt(evt.target.value, 10) || 0
    });
  };

  #offerChangeHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      selectedOffers: checkedOffers.map((checkedOffer) => checkedOffer.dataset.offerId)
    });
  };

  #changeTypeHandler = (evt) => {
    if (!evt.target.className === 'event__type-item') {
      return;
    }

    const selectedType = evt.target.value;
    const newOffers = this.#pointsModel.getOffersByType(selectedType);
    this.#offers = newOffers;

    this._setState({
      ...this._state,
      type: selectedType,
      selectedOffers: []
    });

    this.updateElement({
      type: selectedType,
      selectedOffers: []
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const selectedDestinationName = evt.target.value;

    const destinations = this.#pointsModel.destinations;
    const newDestination = destinations.find(
      (destination) => destination.name === selectedDestinationName
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
    const isClose = true;
    this.#onButtonClick(isClose);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointFormView.parseStateToPoint(this._state));
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(PointFormView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {
      ...point,
      selectedOffers: point.offers || []
    };
  }

  static parseStateToPoint(state) {
    const point = {
      ...state,
      offers: state.selectedOffers
    };

    return point;
  }
}
