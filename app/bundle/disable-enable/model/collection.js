import _ from 'lodash';

export const collection = {};

export function addItem(item) {
  collection[item.uuid] = parseItem(item);
}

export function addCollection(newCollection) {
  _.each(newCollection, addItem);
}

function parseItem(item) {
  const type = item.type.replace('-repost', '');
  const data = item.track || item.playlist;
  const title = data.title;
  const genre = data.genre;
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
    genre,
    trackId,
    trackBy,
    repostBy
  };
}
