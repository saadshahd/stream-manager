import {events as viewEvents} from 'disableEnableView';
import {events as modelEvents, intercept} from 'disableEnableModel';
import {onPlay, onTrackAdded, onFiltersUpdate} from './controller/on';
import {addFilter, removeFilter} from './controller/add-remove';

viewEvents({
  onPlay,
  onTrackAdded
});

modelEvents({
  onFiltersUpdate
});

intercept();

window.streamManager = {
  addFilter,
  removeFilter
};
