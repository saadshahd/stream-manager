import {dropdownButtonClassName, $body, isDropdownOpenClassName} from './globals';

export function dropdownise($element) {
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
