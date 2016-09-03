import $ from 'jquery';
import _ from 'lodash';
import * as icons from './icons';

const streamItemSelector = '.soundList__item';
const streamItemContextSelector = '.soundContext';
const streamItemTitleSelector = '.soundTitle__title span';
const streamAddedNodeClassName = 'g-box-full sceneLayer';
const playControlsClassName = 'playControls';
const playControlClassName = 'playControl';
const playControlSelector = `.${playControlClassName}`;
const isPlayingClassName = `playing`;
const playingItemSelector = `.sound.playing`;
const playButtonSelector = '.playButton';

const prefixClasses = 'ss-sm-';
const dropdownClassName = `${prefixClasses}dropdown`;
const hasDropdownClassName = `${prefixClasses}has-dropdown`;
const isDropdownOpenClassName = `is-open`;
const dropdownButtonClassName = `${dropdownClassName}__button`;
const itemDiabledClassName = `${prefixClasses}disabled`;

const $htmlAndBody = $('html, body');

function generateDropdownActionMarkup({prop, val, text, method = 'add'} = {}) {
  return `<li>
    <button onclick="streamManager.${method}Filter({${prop}: '${val}'}, this)">${text}</button>
  </li>`;
}

function generateDropdownActionsMarkup({
  model = {},
  method,
  actionText = 'Disable'
} = {}) {
  let elementItemsMarkup = ``;
  const {title, genre, trackId, trackBy, repostBy} = model;

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

  if (genre) elementItemsMarkup += generateDropdownActionMarkup({
    prop: 'genre',
    val: genre,
    text: `${actionText} all the posts from ${genre} genre`,
    method
  });

  if (title) elementItemsMarkup += generateDropdownActionMarkup({
    prop: 'title',
    val: title,
    text: `${actionText} all the posts with this title`,
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
  return $element.hasClass(itemDiabledClassName);
}

export function disableItem({$element, model} = {}) {
  const $dropdownList = _$getElementDropdownList($element);

  $dropdownList.html(generateDropdownActionsMarkup({
    model,
    method: 'remove',
    actionText: 'Enable'
  }));

  $element.addClass(itemDiabledClassName);
}

export function enableItem({$element, model} = {}) {
  const $dropdownList = _$getElementDropdownList($element);

  $dropdownList.html(generateDropdownActionsMarkup({model}));
  $element.removeClass(itemDiabledClassName);
}

function _srcollToElement($element) {
  const scrollTop = $element.offset().top - 50;

  $htmlAndBody
    .stop()
    .animate({scrollTop}, 'slow');
}

export function isPlaying($element) {
  return Boolean($element.find(playingItemSelector).length);
}

export function $getPlayingItem() {
  return $(`${streamItemSelector} ${playingItemSelector}`).parents(streamItemSelector);
}

export function $getElementNextItem($element) {
  return $element.next(streamItemSelector);
}

export function playItem($element) {
  const $button = $element.find(`${playButtonSelector}[title="Play"]`);

  $button.click();
  _srcollToElement($element);
}

export function pauseItem($element) {
  const $button = $element.find(`${playButtonSelector}[title="Pause"]`);

  $button.click();
}

export function playNext($element) {
  const $nextElement = $getElementNextItem($element);
  const nextElementIsDisabled = isDisabled($nextElement);
  const itemIsPlaying = isPlaying($element);

  if (itemIsPlaying) pauseItem($element);

  if (nextElementIsDisabled) playNext($nextElement);
  else playItem($nextElement);
}

function _getClassRegex(className) {
  return new RegExp(`(\\s+|^)${className}(\\s+|$)`);
}

export function events({onTrackAdded, onPlay}) {
  const debouncedOnPlay = _.debounce(onPlay);

  const playerObserver = new MutationObserver(items => {
    _.each(items, item => {
      const isClass = item.attributeName === 'class';
      const className = item.target.className;
      const hasPlayingClass = isClass && _getClassRegex(isPlayingClassName).test(className);

      if (hasPlayingClass) debouncedOnPlay();
    });
  });

  const observer = new MutationObserver(items => {
    _.each(items, item => {
      const element = item.addedNodes[0];
      const className = element && element.className;
      const isStreamItem = className === streamAddedNodeClassName;
      const isPlayCotrols = _getClassRegex(playControlsClassName).test(className);

      if (isStreamItem) setTimeout(onTrackAdded.bind(null, element));
      if (isPlayCotrols) {
        const playControlElement = $(element).find(playControlSelector).get(0);
        playerObserver.observe(playControlElement, {attributes: true});
      }
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}
