import { DATE_FORMAT, PointTypes, EditType } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDueDate } from '../utils/date-format.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEditPointFormTemplate (state, offersByType, destinations, destination, formType) {
  const { dateFrom, dateTo, offers, type, basePrice, isDisabled, isSaving, isDeleting } = state;
  const isCreating = formType === EditType.CREATING;

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
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? he.encode(destination.name) : ''}" list="destination-list-1">
                  ${createDestinationsListTemplate(destinations)}
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDueDate(dateFrom, DATE_FORMAT.DATETIME)}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDueDate(dateTo, DATE_FORMAT.DATETIME)}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(basePrice))}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                ${createBtnsTemplate(isCreating, isDisabled, isDeleting)}
              </header>
                <section class="event__details">
                  ${createOffersTemplate(offers, offersByType)}
                  ${createDestinationTemplate(destination)}
                </section>
              </form>
            </li>
          `);
}

function createBtnsTemplate (isCreating, isDisabled, isDeleting) {
  if (isCreating) {
    return '<button class="event__reset-btn" type="reset">Cancel</button>';
  }

  return `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </button>
  `;
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
  if (!destination) {
    return '';
  }

  return (`
    ${destination.description ? `
    <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>` : ''}
        ${destination.pictures?.length ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map(({src, description}) =>
      `<img class="event__photo" src="${src}" alt="${description}">`
    ).join('')}
        </div>
      </div>
    </section>` : ''}
  `);
}

function createOffersTemplate (selectedOffers, offersByType) {
  return (`
    ${offersByType.length ? `
    <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersByType.map(({id, title, price}) => {
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
      </div>
    </section>` : ''}
  `);
}

export default class PointFormView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;
  #destinations = null;
  #destination = null;
  #offers = null;
  #offersByType = null;
  #onButtonClick = null;
  #onFormSubmit = null;
  #handleDeleteClick = null;
  #handleCancelClick = null;
  #editType = EditType.EDITING;

  constructor ({point, offers, offersByType, destinations, destination, onButtonClick, onCancelClick, onFormSubmit, onDeleteClick, type = EditType.EDITING}) {
    super();
    this._setState(PointFormView.parsePointToState(point));
    this.#offers = offers;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#destination = destination;
    this.#onButtonClick = onButtonClick;
    this.#onFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleCancelClick = onCancelClick;
    this.#editType = type;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointFormTemplate(this._state, this.#offersByType, this.#destinations, this.#destination, this.#editType);
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
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);

    if(this.#editType === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonClickHandler);

      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    }
    if(this.#editType === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelBtnClickHandler);
    }


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
    const selectedOffers = checkedOffers.map((checkedOffer) => checkedOffer.dataset.offerId);

    this._setState({
      offers: selectedOffers
    });
  };

  #changeTypeHandler = (evt) => {
    if (!evt.target.className === 'event__type-item') {
      return;
    }

    const selectedType = evt.target.value;
    const newOffersByType = this.#offers.find((offer) => offer.type === selectedType).offers;

    this._setState({
      ...this._state,
      type: selectedType,
      offers: []
    });

    this.#offersByType = newOffersByType;

    this.updateElement({
      type: selectedType,
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const selectedDestinationName = evt.target.value;

    const newDestination = this.#destinations.find(
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

  #cancelBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
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

    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');
    const startTimeInput = this.element.querySelector('#event-start-time-1');
    const endTimeInput = this.element.querySelector('#event-end-time-1');

    const datalistOptions = Array.from(this.element.querySelector('#destination-list-1').options);
    const isValidDestination = datalistOptions.some((option) => option.value === destinationInput.value);

    const hasValidDates = startTimeInput.value && endTimeInput.value && startTimeInput.value !== endTimeInput.value;

    const price = parseInt(priceInput.value, 10);
    const isValidPrice = !isNaN(price) && price > 0 && price <= 100000;

    if (!isValidDestination || !hasValidDates || !isValidPrice) {
      this._setState({
        ...this._state,
        dateFrom: startTimeInput.value ? this._state.dateFrom : null,
        dateTo: endTimeInput.value ? this._state.dateTo : null,
        basePrice: priceInput.value ? parseInt(priceInput.value, 10) : 0
      });

      this.shake();
      return;
    }

    this.#onFormSubmit(PointFormView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
