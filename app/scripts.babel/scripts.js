const script = document.createElement('script');
script.src = chrome.extension.getURL('scripts/main.js');
(document.head || document.documentElement).appendChild(script);

let filters;
loadFilters();

// chrome.storage.sync.clear();

function getItemIndexByFilter(filter) {
  return filters.findIndex(item => {
    const itemKey = Object.keys(item)[0];
    const itemValue = item[itemKey];
    const hasKeyWithSameValue = filter[itemKey] === itemValue;

    return hasKeyWithSameValue;
  });
}

function populateFilters() {
  chrome.runtime.sendMessage(filters);
  console.log(filters);
}

function loadFilters() {
  chrome.storage.sync.get(null, data => {
    filters = Object.keys(data).map(key => data[key]);
    populateFilters();
  });
}

function saveItem(filter) {
  const item = {
    [filters.length]: filter
  };

  chrome.storage.sync.set(item, () => {
    filters.push(filter);
    populateFilters();
  });
}

function deleteItem(index) {
  const key = index.toString();
  const lastKey = filters.length.toString();
  const filtersAfterIndex = filters.slice(index + 1, filters.length + 1);
  const updateFiltersIndex = (function () {
    const items = {};

    filtersAfterIndex.forEach((value, key) => {
      items[key] = value;
    });

    return items;
  })();

  chrome.storage.sync.set(updateFiltersIndex);
  chrome.storage.sync.remove(lastKey);
  chrome.storage.sync.remove(key, () => {
    filters.splice(index, 1);
    populateFilters();
  });
}

function onUpdate({filter, method = 'add'} = {}) {
  const index = getItemIndexByFilter(filter);
  const hasIndex = index !== -1;

  if (method === 'add' && !hasIndex) saveItem(filter);
  if (method === 'remove' && hasIndex) deleteItem(index);
}

window.addEventListener('streamMangerBackground', e => {
  onUpdate(e.detail);
}, false);
