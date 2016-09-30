import {$getElementFromChildNode, enableItem, disableItem} from 'disableEnableView';
import {getFilteredModel, saveFilter, deleteFilter} from 'disableEnableModel';
import {getElementModel} from './get';

export function addFilter(filter, node) {
  const $element = $getElementFromChildNode(node);
  const itemModel = getElementModel($element);
  const filteredModel = getFilteredModel(itemModel, filter);

  saveFilter(filter);
  disableItem({
    $element,
    model: filteredModel
  });
}

export function removeFilter(filter, node) {
  const $element = $getElementFromChildNode(node);
  const itemModel = getElementModel($element);

  deleteFilter(filter);
  enableItem({
    $element,
    model: itemModel
  });
}
