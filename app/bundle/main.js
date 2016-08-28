// import $ from 'jquery';
// import _ from 'lodash';
import * as view from './view';
import * as model from './model';

view.events({
  onTrackAdded
});

model.intercept();

// window.streamManger = {
//   addFilter
// };

function onTrackAdded(node) {
  const $itemElement = view.getElementFromObserveNode(node);
  const title = view.getElementTitle($itemElement);
  const itemModel = model.getItemByTitle(title);

  view.renderDropdown($itemElement, itemModel);
}

// function addFilter(filter, element) {
//   const event = new CustomEvent('streamMangerBackground', {detail: filter});
//   window.dispatchEvent(event);
//
//   disableItem(filter, element);
// }

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
