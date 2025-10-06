import HeaderView from '../view/header-view.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { sortByDay } from '../utils/sort.js';
import { humanizePointDueDate } from '../utils/date-format.js';
import { DayFormat, DISPLAYED_DESTINATION_COUNT } from '../consts.js';

export default class HeaderPresenter {
  #headerComponent = null;

  #pointsModel = null;

  #contentContainer = null;

  constructor({tripMainContainer, pointsModel }) {
    this.#contentContainer = tripMainContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#renderHeaderComponent();
  }

  get #points() {
    const points = [...this.#pointsModel.points];

    return points.sort(sortByDay);
  }

  get #route() {
    const destination = this.#points.map((point) =>
      this.#pointsModel.getDestinationById(point.destination).name);

    const route = destination.length > DISPLAYED_DESTINATION_COUNT ?
      [destination.at(0), '&hellip;', destination.at(-1)]
      : destination;

    return route.join('&nbsp;&mdash;&nbsp;');
  }


  get #duration() {
    const startPoint = this.#points.at(0);
    const endPoint = this.#points.at(-1);

    const startDate = humanizePointDueDate(startPoint.dateFrom, DayFormat.TRIP);
    const endDate = humanizePointDueDate(endPoint.dateTo, DayFormat.TRIP);
    const duration = `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;

    return duration;
  }

  get #totalPrice() {
    const getOffersTotalPrice = (offers) => offers.reduce((acc, offer) => {
      if (offer.isChecked) {
        acc += offer.price;
      }
      return acc;
    }, 0);

    return this.#points.reduce((acc, point) => {
      acc += (+point.basePrice + getOffersTotalPrice(this.#pointsModel.getCheckedOffers(point)));
      return acc;
    }, 0);
  }

  #renderHeaderComponent () {
    if (!this.#points.length) {
      if (this.#headerComponent) {
        remove(this.#headerComponent);
        this.#headerComponent = null;
      }
      return;
    }

    const prevHeaderComponent = this.#headerComponent;

    this.#headerComponent = new HeaderView({
      route: this.#route,
      duration: this.#duration,
      totalPrice: this.#totalPrice
    });

    if (prevHeaderComponent === null) {
      render(this.#headerComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#headerComponent, prevHeaderComponent);
    remove(prevHeaderComponent);
  }

  destroy() {
    if (!this.#headerComponent) {
      return;
    }
    remove(this.#headerComponent);
  }

  #modelEventHandler = () => {
    this.#renderHeaderComponent();
  };
}
