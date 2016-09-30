import * as Eventer from 'event';
import _ from 'lodash';

let filters;

export function matchFilter(itemModel) {
  if (!itemModel) return;

  const matchTitle = _.partial(matchValue, itemModel, _, 'title');
  const matchGenre = _.partial(matchValue, itemModel, _, 'genre');
  const matchId = _.partial(matchValue, itemModel, _, 'trackId');
  const matchBy = _.partial(matchIdValue, itemModel, _, 'trackBy');
  const matchRepost = _.partial(matchIdValue, itemModel, _, 'repostBy');

  return _.find(filters, filter => {
    const title = matchTitle(filter);
    const genre = matchGenre(filter);
    const id = matchId(filter);
    const trackBy = matchBy(filter);
    const repostBy = matchRepost(filter);

    return title || genre || id || trackBy || repostBy;
  });
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

Eventer.on('filtersUpdated', newFilters => {
  filters = newFilters;
});

function matchValue(itemModel, filter, propertyName) {
  return itemModel[propertyName] === filter[propertyName];
}

function matchIdValue(itemModel, filter, propertyName) {
  return itemModel[propertyName] && itemModel[propertyName].id === Number(filter[propertyName]);
}

function _sendData(operation) {
  Eventer.emit('updateFilters', operation);
}
