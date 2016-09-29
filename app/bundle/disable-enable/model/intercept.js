import _ from 'lodash';
import xhrProxy from 'xhrProxy';
import {addCollection} from './collection';

export function intercept() {
  xhrProxy(target => {
    let response;

    try {
      response = JSON.parse(target.response).collection;
    } catch (e) {}

    if (response) {
      const item = _.first(response);
      const isPlayable = item && /track|playlist/.test(item.type);

      if (isPlayable) addCollection(response);
    }
  });
}
