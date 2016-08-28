import $ from 'jquery';
import _ from 'lodash';
import * as icons from './icons';

const streamItemSelector = '.soundList__item';
const streamItemContextSelector = '.soundContext';
const streamItemTitleSelector = '.soundTitle__title span';
const streamAddedNodeClassName = 'g-box-full sceneLayer';
const hasDropdownClassName = 'ss-sm-has-dropdown';

function generateDropdownActionMarkup({prop, val, text, method = 'add'} = {}) {
  return `<li>
    <button onclick="streamManger.${method}Filter({${prop}: '${val}'}, this)">${text}</button>
  </li>`;
}

function generateDropdownActionsMarkup({
  model = {},
  method,
  actionText = 'Disable'
} = {}) {
  let elementItemsMarkup = ``;
  const {trackId, type, trackBy, repostBy} = model;

  if (trackId) elementItemsMarkup += generateDropdownActionMarkup({
    prop: 'trackId',
    val: trackId,
    text: `${actionText} this ${type}`,
    method
  });

  if (trackBy) elementItemsMarkup += generateDropdownActionMarkup({
    prop: 'trackBy',
    val: trackBy.id,
    text: `${actionText} ${trackBy.name}'s ${type}s`,
    method
  });

  if (repostBy) elementItemsMarkup += generateDropdownActionMarkup({
    prop: 'repostBy',
    val: repostBy.id,
    text: `${actionText} ${repostBy.name}'s reposts`,
    method
  });

  return elementItemsMarkup;
}

function generateDropdownMarkup(itemModel) {
  const actionsMarkup = generateDropdownActionsMarkup({model: itemModel});
  const chevronIcon = icons.chevron();

  const $element = $(`<div class="ss-sm-dropdown">
    <button class="ss-sm-dropdown__button">${chevronIcon}</button>
    <div class="ss-sm-dropdown__content">
      <ul class="sc-list-nostyle">${actionsMarkup}</ul>
    </div>
  </div>`);

  return $element;
}

export function getElementFromObserveNode(node) {
  return $(node).parents(streamItemSelector).first();
}

export function getElementTitle($element) {
  return $element.find(streamItemTitleSelector).text();
}

export function renderDropdown($element, itemModel) {
  const elementTitle = getElementTitle($element);
  const $elementContext = $element.find(streamItemContextSelector);
  const hasDropdown = $elementContext.hasClass(hasDropdownClassName);

  if (!hasDropdown) {
    $elementContext.addClass(hasDropdownClassName);
    $elementContext.append(generateDropdownMarkup(itemModel));
    console.log(elementTitle);
  }

}

export function events({
  onTrackAdded = _.noop
} = {}) {
  const observer = new MutationObserver(items => {
    _.each(items, item => {
      const element = item.addedNodes[0];
      const className = element && element.className;
      const isStreamItem = className === streamAddedNodeClassName;

      if (isStreamItem) setTimeout(onTrackAdded.bind(null, element));
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}
