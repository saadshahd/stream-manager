import * as Eventer from 'event';

export function events({onFiltersUpdate}) {
  if (onFiltersUpdate) Eventer.on('filtersUpdated', onFiltersUpdate);
}
