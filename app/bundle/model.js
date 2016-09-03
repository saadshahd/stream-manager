import $ from 'jquery';
import _ from 'lodash';
import xhrProxy from './xhr-proxy';
import * as Eventer from './event';

const collection = {};
let filters;

_listenToFiltersChange();

function _sendData(operation) {
  Eventer.emit('updateFilters', operation);
}

function _listenToFiltersChange() {
  Eventer.on('filtersUpdated', newFilters => {
    filters = newFilters;
  });
}

export function intercept() {
  xhrProxy(target => {
    let response;

    try {
      response = $.parseJSON(target.response).collection;
    } catch (e) {}

    if (response) {
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

export function add(item) {
  collection[item.uuid] = parseItem(item);
}

export function addCollection(newCollection) {
  _.each(newCollection, add);
}

export function saveFilter(filter) {
  _sendData({
    filter,
    method: 'add'
  });
}

export function deleteFilter(filter) {
  _sendData({
    filter,
    method: 'remove'
  });
}

function matchValue(itemModel, filter, propertyName) {
  return itemModel[propertyName] === filter[propertyName];
}

function matchIdValue(itemModel, filter, propertyName) {
  return itemModel[propertyName] && itemModel[propertyName].id === Number(filter[propertyName]);
}

export function matchFilter(itemModel) {
  if (!itemModel) return;

  const matchTitle = _.partial(matchValue, itemModel, _, 'title');
  const matchGenre = _.partial(matchValue, itemModel, _, 'genre');
  const matchId = _.partial(matchValue, itemModel, _, 'trackId');
  const matchBy = _.partial(matchIdValue, itemModel, _, 'trackBy');
  const matchRepost = _.partial(matchIdValue, itemModel, _, 'repostBy');

  return _.find(filters, filter => {
    const hasTitle = matchTitle(filter);
    const hasGenre = matchGenre(filter);
    const hasId = matchId(filter);
    const hasBy = matchBy(filter);
    const hasRepost = matchRepost(filter);

    return hasTitle || hasGenre || hasId || hasBy || hasRepost;
  });
}

export function events({onFiltersUpdate}) {
  if (onFiltersUpdate) Eventer.on('filtersUpdated', onFiltersUpdate);
}
