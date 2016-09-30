import $ from 'jquery';

export const streamItemSelector = '.soundList__item';
export const streamItemContextSelector = '.soundContext';
export const streamItemTitleSelector = '.soundTitle__title span';
export const streamAddedNodeClassName = 'g-box-full sceneLayer';

export const playControlsClassName = 'playControls';
export const playControlClassName = 'playControl';
export const playControlSelector = `.${playControlClassName}`;

export const isPlayingClassName = `playing`;
export const playingItemSelector = `.sound.${isPlayingClassName}`;
export const playButtonSelector = '.playButton';

export const prefixClasses = 'ss-sm-';
export const dropdownClassName = `${prefixClasses}dropdown`;
export const hasDropdownClassName = `${prefixClasses}has-dropdown`;
export const isDropdownOpenClassName = `is-open`;
export const dropdownButtonClassName = `${dropdownClassName}__button`;
export const itemDiabledClassName = `${prefixClasses}disabled`;

export const $htmlAndBody = $('html, body');
export const $body = $('body');

export function $eachElement($elements, fn) {
  $elements.each(function () {
    fn($(this));
  });
}
