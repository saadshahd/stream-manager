import {isDisabled, isPlaying, playNext, disableItem, enableItem} from 'disableEnableView';
import {matchFilter, getFilteredModel} from 'disableEnableModel';

export function filterElement($element, itemModel) {
  const matchedFilter = matchFilter(itemModel);
  const elementIsDiabled = isDisabled($element);

  if (matchedFilter) {
    const filteredModel = getFilteredModel(itemModel, matchedFilter);
    const itemIsPlaying = isPlaying($element);

    if (itemIsPlaying) playNext($element);

    disableItem({
      $element,
      model: filteredModel
    });
  } else if (elementIsDiabled) {
    enableItem({
      $element,
      model: itemModel
    });
  }
}
