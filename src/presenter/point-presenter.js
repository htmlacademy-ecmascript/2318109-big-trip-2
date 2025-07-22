import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import AddPointFormView from '../view/add-point-form-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import PointView from '../view/point-view.js';
import { RenderPosition } from '../render.js';
import { render } from '../render';

export default class PointPresenter {
  filterCompanent = new FilterView();
  sortCompanent = new SortView();

  constructor({filterContainer, contentContainer}) {
    this.filterContainer = filterContainer;
    this.contentContainer = contentContainer;
  }

  init() {
    render(this.filterCompanent, this.filterContainer);
    render(this.sortCompanent, this.contentContainer);
    render(new AddPointFormView(), this.contentContainer);
    render(new EditPointFormView(), this.contentContainer, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.contentContainer);
    }
  }
}
