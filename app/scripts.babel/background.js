'use strict';
chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

let items;
loadItems();

// chrome.storage.sync.clear();

function getItemIndexByFilter(filter) {
  return items.findIndex(item => {
    const itemKey = Object.keys(item)[0];
    const itemValue = item[itemKey];
    const hasKeyWithSameValue = filter[itemKey] === itemValue;

    return hasKeyWithSameValue;
  });
}

function loadItems() {
  chrome.storage.sync.get(null, data => {
    items = Object.keys(data).map(key => data[key]);
    console.log(items);
  });
}

function saveItem(filter) {
  const item = {
    [items.length]: filter
  };

  chrome.storage.sync.set(item, () => {
    items.push(filter);
    console.log(items);
  });
}

function deleteItem(index) {
  const key = index.toString();

  chrome.storage.sync.remove(key, () => {
    items.splice(index, 1);
    console.log(items);
  });
}

chrome.runtime.onMessage.addListener(({filter, method = 'add'} = {}) => {
  const index = getItemIndexByFilter(filter);
  const hasIndex = index !== -1;

  if (method === 'add' && !hasIndex) saveItem(filter);
  if (method === 'remove' && hasIndex) deleteItem(index);
});
