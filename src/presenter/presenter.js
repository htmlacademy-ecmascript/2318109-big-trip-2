import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import AddPointFormView from '../view/add-point-form-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import PointView from '../view/point-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class Presenter {
  filterCompanent = new FilterView();
  sortCompanent = new SortView();

  constructor({filterContainer, contentContainer, pointsModel}) {
    this.filterContainer = filterContainer;
    this.contentContainer = contentContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];
    this.offer = [...this.pointsModel.getOffers()];
    this.destinations = [...this.pointsModel.getDestinations()];

    render(this.filterCompanent, this.filterContainer);
    render(this.sortCompanent, this.contentContainer);
    render(new AddPointFormView({point: this.points[1], offer: this.offer, destinations: this.destinations}), this.contentContainer);
    render(new EditPointFormView({point: this.points[0], offer: this.offer, destinations: this.destinations}), this.contentContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.points.length; i++) {
      render(new PointView({point: this.points[i], offer: this.offer, destinations: this.destinations}), this.contentContainer);
    }
  }
}
