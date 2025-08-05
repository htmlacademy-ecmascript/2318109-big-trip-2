import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import AddPointFormView from '../view/add-point-form-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import PointView from '../view/point-view.js';
import { RenderPosition, render } from '../render.js';

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

    render(this.filterCompanent, this.filterContainer);
    render(this.sortCompanent, this.contentContainer);
    render(new AddPointFormView(), this.contentContainer);
    render(new EditPointFormView(), this.contentContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.points.length; i++) {
      render(new PointView({point: this.points[i]}), this.contentContainer);
    }
  }
}
