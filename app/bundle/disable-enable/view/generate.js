import $ from 'jquery';
import * as icons from 'icons';
import {dropdownClassName, dropdownButtonClassName} from './globals';
import {dropdownise} from './dropdownise';

export function generateDropdownMarkup(itemModel) {
  const actionsMarkup = generateDropdownActionsMarkup({model: itemModel});
  const chevronIcon = icons.chevron();

  const $element = $(`<div class="${dropdownClassName}">
    <button class="${dropdownButtonClassName}">${chevronIcon}</button>
    <div class="${dropdownClassName}__content">
      <ul class="sc-list-nostyle">${actionsMarkup}</ul>
    </div>
  </div>`);

  dropdownise($element);

  return $element;
}

export function generateDropdownActionsMarkup({
  model = {},
  method,
  actionText = 'Disable'
} = {}) {
  const {title, genre, trackId, trackBy, repostBy} = model;

  let elementItemsMarkup = ``;

  if (trackId) elementItemsMarkup += generateTrackIdActionMarkup(method, actionText, trackId);
  if (trackBy) elementItemsMarkup += generateTrackByActionMarkup(method, actionText, trackBy);
  if (repostBy) elementItemsMarkup += generateRepostByActionMarkup(method, actionText, repostBy);
  if (genre) elementItemsMarkup += generateGenreActionMarkup(method, actionText, genre);
  if (title) elementItemsMarkup += generateTitleActionMarkup(method, actionText, title);

  return elementItemsMarkup;
}

function generateTrackIdActionMarkup(method, actionText, trackId) {
  return generateDropdownActionMarkup({
    prop: 'trackId',
    val: trackId,
    text: `${actionText} this post`,
    method
  });
}

function generateTrackByActionMarkup(method, actionText, trackBy) {
  return generateDropdownActionMarkup({
    prop: 'trackBy',
    val: trackBy.id,
    text: `${actionText} ${trackBy.name}'s posts`,
    method
  });
}

function generateRepostByActionMarkup(method, actionText, repostBy) {
  return generateDropdownActionMarkup({
    prop: 'repostBy',
    val: repostBy.id,
    text: `${actionText} ${repostBy.name}'s reposts`,
    method
  });
}

function generateGenreActionMarkup(method, actionText, genre) {
  return generateDropdownActionMarkup({
    prop: 'genre',
    val: genre,
    text: `${actionText} all the posts from ${genre} genre`,
    method
  });
}

function generateTitleActionMarkup(method, actionText, title) {
  return generateDropdownActionMarkup({
    prop: 'title',
    val: title,
    text: `${actionText} all the posts with this title`,
    method
  });
}

function generateDropdownActionMarkup({prop, val, text, method = 'add'} = {}) {
  return `<li>
    <button onclick="streamManager.${method}Filter({${prop}: '${val}'}, this)">${text}</button>
  </li>`;
}
