import $ from 'jquery';
// import _ from 'lodash';
import * as view from './view';
import * as model from './model';

let filtersReady = false;

view.events({
  onPlay,
  onTrackAdded
});

model.events({
  onFiltersUpdate
});

model.intercept();

window.streamManger = {
  addFilter,
  removeFilter
};

function onPlay() {
  const $playingElement = view.$getPlayingItem();
  const itemModel = getItemModelFromElement($playingElement);
  const matchFilter = model.matchFilter(itemModel);

  if (matchFilter) view.playNext($playingElement);
}

function onFiltersUpdate() {
  const $elements = view.$getElementAllItems();

  $elements.each(function () {
    const $element = $(this);
    const itemModel = getItemModelFromElement($element);

    if (filtersReady) filterElement($element, itemModel);
  });

  if (!filtersReady) filtersReady = true;
}

function getItemModelFromElement($element) {
  const title = view.getElementTitle($element);
  const itemModel = model.getItemByTitle(title);

  return itemModel;
}

function filterElement($element, itemModel) {
  const matchFilter = model.matchFilter(itemModel);
  const elementIsDiabled = view.isDisabled($element);

  if (matchFilter) {
    const filteredModel = model.getFilteredModel(itemModel, matchFilter);
    const itemIsPlaying = view.isPlaying($element);

    if (itemIsPlaying) view.playNext($element);

    view.disableItem({
      $element,
      model: filteredModel
    });
  } else if (elementIsDiabled) {
    view.enableItem({
      $element,
      model: itemModel
    });
  }
}

function renderElement($element) {
  const itemModel = getItemModelFromElement($element);

  view.renderDropdown($element, itemModel);

  if (filtersReady) filterElement($element, itemModel);
}

function onTrackAdded(node) {
  const $element = view.$getElementFromChildNode(node);
  const elementIsRendered = view.isRendered($element);

  if (!elementIsRendered) renderElement($element);
}

function addFilter(filter, node) {
  const $element = view.$getElementFromChildNode(node);
  const itemModel = getItemModelFromElement($element);
  const filteredModel = model.getFilteredModel(itemModel, filter);

  model.saveFilter(filter);
  view.disableItem({
    $element,
    model: filteredModel
  });
}

function removeFilter(filter, node) {
  const $element = view.$getElementFromChildNode(node);
  const itemModel = getItemModelFromElement($element);

  model.deleteFilter(filter);
  view.enableItem({
    $element,
    model: itemModel
  });
}
