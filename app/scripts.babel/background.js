'use strict';
chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

let items;

chrome.storage.sync.get(null, data => {
  items = Object.keys(data).map(key => data[key]);
  console.log(data, items);
});

chrome.runtime.onMessage.addListener(filter => {
  const item = {
    [items.length]: filter
  };

  console.log(item);

  chrome.storage.sync.set(item, () => {
    items.push(filter);
    chrome.storage.sync.get(null, console.log);
  });
});
