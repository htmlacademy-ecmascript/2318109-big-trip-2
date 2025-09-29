import NewPointBtnView from '../view/new-point-btn-view.js';
import { render } from '../framework/render.js';

export default class NewPointBtnPresenter {
  #tripMainContainer = null;

  #newPointBtnComponent = null;

  constructor({tripMainContainer}) {
    this.#tripMainContainer = tripMainContainer;
  }

  init() {
    this.#newPointBtnComponent = new NewPointBtnView({
      onButtonClick :  this.#buttonClickHandler
    });

    render(this.#newPointBtnComponent, this.#tripMainContainer);
  }

  #buttonClickHandler = () => {
    console.log('openForm');
  };

}
