import $ from 'jquery';
// import _ from 'lodash';
import * as view from './view';
import * as model from './model';

view.events({
  onTrackAdded
});

model.intercept();

window.streamManger = {
  addFilter,
  removeFilter
};

function getItemModelFromElement($element) {
  const title = view.getElementTitle($element);
  const itemModel = model.getItemByTitle(title);

  return itemModel;
}

function onTrackAdded(node) {
  const $element = view.$getElementFromChildNode(node);
  const itemModel = getItemModelFromElement($element);

  view.renderDropdown($element, itemModel);
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

// function disableItem({type, trackId, trackBy, repostBy} = {}, element) {
//   const $element = $(element).parents(streamItemSelector);
//   const $elementList = $element.find('.ss-stream-manger ul');
//   const elementItemsMarkup = generateItemsMarkup({
//     type, trackId, trackBy, repostBy,
//     method: 'remove',
//     actionText: 'Enable'
//   });
//
//   $element.addClass('disabled');
//   $elementList.html(elementItemsMarkup);
// }
