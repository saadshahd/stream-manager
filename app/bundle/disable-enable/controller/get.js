import {getElementTitle} from 'disableEnableView';
import {getItemByTitle} from 'disableEnableModel';

export function getElementModel($element) {
  const title = getElementTitle($element);
  const itemModel = getItemByTitle(title);

  return itemModel;
}
