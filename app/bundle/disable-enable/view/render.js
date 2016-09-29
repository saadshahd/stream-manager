import {$htmlAndBody, hasDropdownClassName, itemDiabledClassName} from './globals';
import {generateDropdownMarkup, generateDropdownActionsMarkup} from './generate';
import {$getElementContext, $getElementDropdownList} from './get';
import {isRendered} from './state';

export function renderDropdown($element, itemModel) {
  const $elementContext = $getElementContext($element);
  const elmentIsRendered = isRendered($element);

  if (!elmentIsRendered) {
    $elementContext.addClass(hasDropdownClassName);
    $elementContext.append(generateDropdownMarkup(itemModel));
  }
}

export function disableItem({$element, model} = {}) {
  const $dropdownList = $getElementDropdownList($element);

  $dropdownList.html(generateDropdownActionsMarkup({
    model,
    method: 'remove',
    actionText: 'Enable'
  }));

  $element.addClass(itemDiabledClassName);
}

export function enableItem({$element, model} = {}) {
  const $dropdownList = $getElementDropdownList($element);

  $dropdownList.html(generateDropdownActionsMarkup({model}));
  $element.removeClass(itemDiabledClassName);
}

export function srcollToElement($element) {
  const scrollTop = $element.offset().top - 50;

  $htmlAndBody
    .stop()
    .animate({scrollTop}, 'slow');
}
