import {
  $getElements, $eachElement, $getElementFromChildNode, $getPlayingItem,
  playNext, isRendered
} from 'disableEnableView';

import {matchFilter} from 'disableEnableModel';
import {getElementModel} from './get';
import {filterElement} from './filter';
import {render} from './render';

export function onFiltersUpdate() {
  const $elements = $getElements();

  $eachElement($elements, $element => {
    const itemModel = getElementModel($element);

    filterElement($element, itemModel);
  });
}

export function onTrackAdded(node) {
  const $element = $getElementFromChildNode(node);
  const elementIsRendered = isRendered($element);

  if (!elementIsRendered) render($element);
}

export function onPlay() {
  const $playingElement = $getPlayingItem();
  const itemModel = getElementModel($playingElement);
  const matchedFilter = matchFilter(itemModel);

  if (matchedFilter) playNext($playingElement);
}
