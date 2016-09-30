import $ from 'jquery';
import {
  streamItemSelector, streamItemContextSelector, streamItemTitleSelector,
  dropdownClassName, playingItemSelector
} from './globals';

export function $getElements() {
  return $(streamItemSelector);
}

export function $getElementFromChildNode(node) {
  return $(node).parents(streamItemSelector).first();
}

export function $getElementContext($element) {
  return $element.find(streamItemContextSelector);
}

export function $getElementDropdownList($element) {
  return $element.find(`.${dropdownClassName} ul`);
}

export function $getPlayingItem() {
  return $(`${streamItemSelector} ${playingItemSelector}`).parents(streamItemSelector);
}

export function $getElementNextItem($element) {
  return $element.next(streamItemSelector);
}

export function getElementTitle($element) {
  return $element.find(streamItemTitleSelector).text();
}

export function getClassRegex(className) {
  return new RegExp(`(\\s+|^)${className}(\\s+|$)`);
}
