'use strict';
chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

let items;

chrome.storage.sync.get(null, data => {
  items = Object.keys(data).map(key => data[key]);
});

chrome.runtime.onMessage.addListener(filter => {
  const item = {
    [items.length]: filter
  };

  chrome.storage.sync.set(item, () => {
    items.push(filter);
  });
});
