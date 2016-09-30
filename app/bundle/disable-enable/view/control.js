import {playButtonSelector} from './globals';
import {$getElementNextItem} from './get';
import {isDisabled, isPlaying} from './state';
import {srcollToElement} from './render';

function playItem($element) {
  $element.find(`${playButtonSelector}[title="Play"]`).click();
  srcollToElement($element);
}

function pauseItem($element) {
  $element.find(`${playButtonSelector}[title="Pause"]`).click();
}

export function playNext($element) {
  const $nextElement = $getElementNextItem($element);
  const nextElementIsDisabled = isDisabled($nextElement);
  const itemIsPlaying = isPlaying($element);

  if (itemIsPlaying) pauseItem($element);

  if (nextElementIsDisabled) playNext($nextElement);
  else playItem($nextElement);
}
