import $ from 'jquery';
import _ from 'lodash';
import * as icons from './icons';

const streamItemSelector = '.soundList__item';
const streamItemDiabledClassName = 'disabled';
const streamItemContextSelector = '.soundContext';
const streamItemTitleSelector = '.soundTitle__title span';
const streamAddedNodeClassName = 'g-box-full sceneLayer';

const prefixClasses = 'ss-sm-';
const dropdownClassName = `${prefixClasses}dropdown`;
const hasDropdownClassName = `${prefixClasses}has-dropdown`;
const isDropdownOpenClassName = `is-open`;
const dropdownButtonClassName = `${dropdownClassName}__button`;

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
  const {trackId, trackBy, repostBy} = model;

  if (trackId) elementItemsMarkup += generateDropdownActionMarkup({
    prop: 'trackId',
    val: trackId,
    text: `${actionText} this post`,
    method
  });

  if (trackBy) elementItemsMarkup += generateDropdownActionMarkup({
    prop: 'trackBy',
    val: trackBy.id,
    text: `${actionText} ${trackBy.name}'s posts`,
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

  const $element = $(`<div class="${dropdownClassName}">
    <button class="${dropdownButtonClassName}">${chevronIcon}</button>
    <div class="${dropdownClassName}__content">
      <ul class="sc-list-nostyle">${actionsMarkup}</ul>
    </div>
  </div>`);

  _dropdownise($element);

  return $element;
}

export function isRendered($element) {
  const $elementContext = _$getElementContext($element);
  const hasDropdown = _hasDropdown($elementContext);

  return hasDropdown;
}

export function renderDropdown($element, itemModel) {
  const $elementContext = _$getElementContext($element);
  const elmentIsRendered = isRendered($element);

  if (!elmentIsRendered) {
    $elementContext.addClass(hasDropdownClassName);
    $elementContext.append(generateDropdownMarkup(itemModel));
  }
}

export function getElementTitle($element) {
  return $element.find(streamItemTitleSelector).text();
}

export function $getElementFromChildNode(node) {
  return $(node).parents(streamItemSelector).first();
}

export function $getElementAllItems() {
  return $(streamItemSelector);
}

function _$getElementContext($element) {
  return $element.find(streamItemContextSelector);
}

function _$getElementDropdownList($element) {
  return $element.find(`.${dropdownClassName} ul`);
}

function _hasDropdown($elementContext) {
  return $elementContext.hasClass(hasDropdownClassName);
}

function _dropdownise($element) {
  const $body = $('body');
  const $elementToggle = $element.find(`.${dropdownButtonClassName}`);

  function open() {
    $body.off('click', close);
    $elementToggle.parent().addClass(isDropdownOpenClassName);

    setTimeout(() => $body.click(close));
  }

  function close() {
    $elementToggle.parent().removeClass(isDropdownOpenClassName);
    $body.off('click', close);
  }

  $elementToggle.click(open);
}

export function isDisabled($element) {
  return $element.hasClass(streamItemDiabledClassName);
}

export function disableItem({$element, model} = {}) {
  const $dropdownList = _$getElementDropdownList($element);

  $dropdownList.html(generateDropdownActionsMarkup({
    model,
    method: 'remove',
    actionText: 'Enable'
  }));

  $element.addClass(streamItemDiabledClassName);
}

export function enableItem({$element, model} = {}) {
  const $dropdownList = _$getElementDropdownList($element);

  $dropdownList.html(generateDropdownActionsMarkup({model}));
  $element.removeClass(streamItemDiabledClassName);
}

export function events({onTrackAdded}) {
  const observer = new MutationObserver(items => {
    _.each(items, item => {
      const element = item.addedNodes[0];
      const className = element && element.className;
      const isStreamItem = className === streamAddedNodeClassName;

      if (isStreamItem && onTrackAdded) setTimeout(onTrackAdded.bind(null, element));
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}
