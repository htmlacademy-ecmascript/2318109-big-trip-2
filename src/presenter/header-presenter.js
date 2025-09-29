import NewPointBtnView from '../view/new-point-btn-view.js';
// import HeaderView from '../view/header-view.js';
import { render } from '../framework/render.js';

export default class HeaderPresenter {
  #tripMainContainer = null;

  #newPointBtnComponent = null;

  constructor({tripMainContainer}) {
    this.#tripMainContainer = tripMainContainer;
  }

  init() {
    this.#newPointBtnComponent = new NewPointBtnView({
      onButtonClick : this.#addNewPointHandler
    });

    render(this.#newPointBtnComponent, this.#tripMainContainer);
  }

  #addNewPointHandler = () => {
    console.log('openForm');
  };

}

// pointPresenter.setAddNewPointButton(#newPointBtnComponent);

