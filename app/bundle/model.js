import $ from 'jquery';
import _ from 'lodash';
import xhrProxy from './xhr-proxy';

const collection = {};

function _tirggerBackgroundEvent(detail) {
  window.dispatchEvent(new CustomEvent('streamMangerBackground', {detail}));
}

export function intercept() {
  xhrProxy(target => {
    const response = $.parseJSON(target.response).collection;

    if (collection) {
      const item = _.first(response);
      const isPlayable = item && /track|playlist/.test(item.type);

      if (isPlayable) addCollection(response);
    }
  });
}

export function getItemByTitle(title) {
  return _.find(collection, {title});
}

export function getFilteredModel(itemModel, filter) {
  const filterKey = _.keys(filter)[0];

  return {
    type: itemModel.type,
    [filterKey]: itemModel[filterKey]
  };
}

export function parseItem(item) {
  const type = item.type.replace('-repost', '');
  const data = item.track || item.playlist;
  const title = data.title;
  const isRepost = /-repost/.test(item.type);

  const trackId = item.uuid;
  const trackBy = {
    id: data.user.id,
    name: data.user.username
  };

  const repostBy = isRepost && {
    id: item.user.id,
    name: item.user.username
  };

  return {
    type,
    title,
    trackId,
    trackBy,
    repostBy
  };
}

export function add(item) {
  collection[item.uuid] = parseItem(item);
}

export function addCollection(newCollection) {
  _.each(newCollection, add);
}

export function saveFilter(filter) {
  _tirggerBackgroundEvent({
    filter,
    method: 'add'
  });
}

export function deleteFilter(filter) {
  _tirggerBackgroundEvent({
    filter,
    method: 'remove'
  });
}

// export function matchFilter(itemModel) {
//   return _.find(collection, filter => {
//     console.log(filter);
//   });
// }
