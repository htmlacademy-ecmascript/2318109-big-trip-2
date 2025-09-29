import AbstractView from '../framework/view/abstract-view';

function createHeaderTemplate() {
  return (`
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title"></h1>
        <p class="trip-info__dates"></p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value"></span>
      </p>
    </section>
  `);
}

export default class HeaderView extends AbstractView{

  get template() {
    return createHeaderTemplate();
  }

}
