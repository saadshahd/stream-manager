import {hasDropdownClassName, itemDiabledClassName, playingItemSelector} from './globals';
import {$getElementContext} from './get';

export function hasDropdown($elementContext) {
  return $elementContext.hasClass(hasDropdownClassName);
}

export function isDisabled($element) {
  return $element.hasClass(itemDiabledClassName);
}

export function isPlaying($element) {
  return Boolean($element.find(playingItemSelector).length);
}

export function isRendered($element) {
  const $elementContext = $getElementContext($element);

  return hasDropdown($elementContext);
}
