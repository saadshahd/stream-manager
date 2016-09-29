import _ from 'lodash';
import {collection} from './collection';

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
