import _ from 'lodash';
import {
  streamAddedNodeClassName, isPlayingClassName, playControlsClassName, playControlSelector
} from './globals';
import {getClassRegex} from './get';

export function events({onTrackAdded, onPlay}) {
  const debouncedOnPlay = _.debounce(onPlay);

  const playerObserver = new MutationObserver(items => {
    _.each(items, item => {
      const isClass = item.attributeName === 'class';
      const className = item.target.className;
      const hasPlayingClass = isClass && getClassRegex(isPlayingClassName).test(className);

      if (hasPlayingClass) debouncedOnPlay();
    });
  });

  const observer = new MutationObserver(items => {
    _.each(items, item => {
      const element = item.addedNodes[0];
      const className = element && element.className;
      const isStreamItem = className === streamAddedNodeClassName;
      const isPlayCotrols = getClassRegex(playControlsClassName).test(className);

      if (isStreamItem) setTimeout(onTrackAdded.bind(null, element));
      if (isPlayCotrols) {
        const playControlElement = element.querySelector(playControlSelector);
        playerObserver.observe(playControlElement, {attributes: true});
      }
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true
  });
}
