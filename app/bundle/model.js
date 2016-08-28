import $ from 'jquery';
import _ from 'lodash';
import xhrProxy from './xhr-proxy';

const collection = {};

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

export function parseItem(item) {
  const type = item.type.replace('-repost', '');
  const data = item.track || item.playlist;
  const title = data.title;
  const isRepost = /-repost/.test(type);

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
