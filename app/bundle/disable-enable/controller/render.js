import {renderDropdown} from 'disableEnableView';
import {getElementModel} from './get';
import {filterElement} from './filter';

export function render($element) {
  const itemModel = getElementModel($element);

  renderDropdown($element, itemModel);
  filterElement($element, itemModel);
}
