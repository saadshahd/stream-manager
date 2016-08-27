(function () {
  const loadStreamItemsExp = /soundcloud.com\/stream/g;
  const streamItemSelector = '.soundList__item';
  const streamItemContextSelector = '.soundContext';
  const streamItemTitleSelector = '.soundTitle__title span';
  const streamAddedNodeClassName = 'waveformCommentsNode';

  const observer = new MutationObserver(items => {
    _.each(items, item => {
      const element = item.addedNodes[0];
      const className = element && element.className;
      const isStreamItem = className && className.includes(streamAddedNodeClassName);

      if (isStreamItem) setTimeout(onTrackAdded.bind(null, element));
    });
  });

  let streamItems = [];

  (function (send) {
    XMLHttpRequest.prototype.send = function (data) {
      send.call(this, data);
      this.addEventListener('load', e => {
        const isStreamListEndPoint = loadStreamItemsExp.test(e.target.responseURL);

        if (isStreamListEndPoint) {
          const newItems = JSON.parse(e.target.response).collection;
          streamItems = streamItems.concat(newItems);
        }
      });
    };
  })(XMLHttpRequest.prototype.send);

  loadScripts([
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.min.js'
  ], onScriptsLoadded);

  window.streamManger = {
    addFilter
  };

  function onTrackAdded(element) {
    const $item = $(element).parents(streamItemSelector).first();

    renderItem($item);
  }

  function addFilter(filter, element) {
    const event = new CustomEvent('streamMangerBackground', {detail: filter});
    window.dispatchEvent(event);

    disableItem(filter, element);
  }

  function disableItem({type, trackId, trackBy, repostBy} = {}, element) {
    const $element = $(element).parents(streamItemSelector);
    const $elementList = $element.find('.ss-stream-manger ul');
    const elementItemsMarkup = generateItemsMarkup({
      type, trackId, trackBy, repostBy,
      method: 'remove',
      actionText: 'Enable'
    });

    $element.addClass('disabled');
    $elementList.html(elementItemsMarkup);
  }

  function generateItemMarkup({prop, val, text, method} = {}) {
    return `<li>
      <button onclick="streamManger.${method}Filter({${prop}: '${val}'}, this)">${text}</button>
    </li>`;
  }

  function generateItemsMarkup({
    type = 'track',
    trackId, trackBy, repostBy,
    method = 'add',
    actionText = 'Disable'
  } = {}) {
    let elementItemsMarkup = ``;

    if (trackId) elementItemsMarkup += generateItemMarkup({
      prop: `trackId`,
      val: trackId,
      text: `${actionText} this ${type}`,
      method
    });

    if (trackBy) elementItemsMarkup += generateItemMarkup({
      prop: `trackBy`,
      val: trackBy.id,
      text: `${actionText} ${trackBy.name}'s ${type}s`,
      method
    });

    if (repostBy) elementItemsMarkup += generateItemMarkup({
      prop: 'repostBy',
      val: repostBy.id,
      text: `${actionText} ${repostBy.name}'s reposts`,
      method
    });

    return elementItemsMarkup;
  }

  function generateMarkup({type, trackId, trackBy, repostBy} = {}) {
    const elementItemsMarkup = generateItemsMarkup({type, trackId, trackBy, repostBy});

    const $element = $(`<div class="ss-stream-manger">
      <button class="ss-stream-manger__arrow">▼</button>
      <div class="ss-stream-manger__dropdown">
        <ul class="sc-list-nostyle">${elementItemsMarkup}</ul>
      </div>
    </div>`);

    dropdownToggle($element);

    return $element;
  }

  function dropdownToggle($element) {
    const $body = $('body');
    const $elementToggle = $element.find('.ss-stream-manger__arrow');

    function open() {
      $body.off('click', close);
      $elementToggle.parent().addClass('is-open');

      setTimeout(() => {
        $body.on('click', close);
      });
    }

    function close() {
      $elementToggle.parent().removeClass('is-open');
      $body.off('click', close);
    }

    $elementToggle.click(open);
  }

  function renderItem($element) {
    const $elementContext = $element.find(streamItemContextSelector);
    const elementTitle = $element.find(streamItemTitleSelector).text();
    const itemModel = _.find(streamItems, item => {
      return (item.track || item.playlist).title === elementTitle;
    });

    if (!itemModel) return;

    const itemType = itemModel.type.replace('-repost', '');
    const itemData = itemModel.track || itemModel.playlist;
    const isRepost = /-repost/.test(itemModel.type);
    const trackBy = {
      id: itemData.user.id,
      name: itemData.user.username
    };

    const repostBy = isRepost && {
      id: itemModel.user.id,
      name: itemModel.user.username
    };

    $elementContext.append(generateMarkup({
      type: itemType,
      trackId: itemModel.uuid,
      trackBy,
      repostBy
    }));

    console.log(elementTitle);
  }

  function onScriptsLoadded() {
    $(document).ready(() => {
      observer.observe(document, {
        childList: true,
        subtree: true
      });
    });
  }

  function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    (document.head || document.documentElement).appendChild(script);
  }

  function loadScripts(urls, callback) {
    let loaddedCount = 0;
    const urlsCount = urls.length;
    const loadScriptCallBack = () => {
      loaddedCount++;
      if (loaddedCount === urlsCount) callback();
    };

    urls.forEach(url => {
      loadScript(url, loadScriptCallBack);
    });
  }
})();
