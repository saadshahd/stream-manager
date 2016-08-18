(function () {
  const streamItemSelector = '.stream .soundList__item';
  const streamItemContextSelector = '.soundContext';
  const streamItemTitleSelector = '.soundTitle__title span';

  let streamItems = [];
  let itemsElements;
  let oldCountOfElements = 0;

  (function () {
    const loadStreamItemsExp = /soundcloud.com\/stream/g;
    const startStreamSessionExp = /soundcloud.com\/dashbox\/stream/g;

    (function (send) {
      XMLHttpRequest.prototype.send = function (data) {
        send.call(this, data);
        this.addEventListener('load', e => {
          const isStreamListEndPoint = loadStreamItemsExp.test(e.target.responseURL);
          const isStreamSessionEndPoint = startStreamSessionExp.test(e.target.responseURL);
          const isStreamEndPoint = isStreamListEndPoint || isStreamSessionEndPoint;

          let newItems;
          let countOfElements;
          let shouldStartOver;
          let newAddedElementsCount;

          if (isStreamEndPoint) {
            if (isStreamListEndPoint) {
              newItems = JSON.parse(e.target.response).collection;
              streamItems = streamItems.concat(newItems);
            }

            itemsElements = $(streamItemSelector);
            countOfElements = itemsElements.length;
            shouldStartOver = oldCountOfElements > countOfElements;

            if (shouldStartOver) oldCountOfElements = 0;

            newAddedElementsCount = countOfElements - oldCountOfElements;

            if (newAddedElementsCount) {
              renderItems(oldCountOfElements);
              oldCountOfElements = countOfElements;
            }
          }
        });
      };
    })(XMLHttpRequest.prototype.send);
  })();

  loadScripts([
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.min.js'
  ], onScriptsLoadded);

  window.streamManger = {
    addFilter
  };

  function addFilter(filter) {
    const event = new CustomEvent('streamMangerBackground', {detail: filter});
    window.dispatchEvent(event);
  }

  function generateItemMarkup(prop, val, text) {
    return `<li>
      <button onclick="streamManger.addFilter({${prop}: '${val}'})">${text}</button>
    </li>`;
  }

  function generateMarkup({type = 'track', trackId, trackBy, repostBy} = {}) {
    let elementItemsMarkup = ``;

    if (trackId) elementItemsMarkup += generateItemMarkup(`${type}Id`, trackId, `Hide this ${type}`);
    if (trackBy) elementItemsMarkup += generateItemMarkup(`${type}By`, trackBy.id, `Hide ${trackBy.name}'s ${type}s`);
    if (repostBy) elementItemsMarkup += generateItemMarkup('repostBy', repostBy.id, `Hide ${repostBy.name}'s reposts`);

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

  function renderItems(oldElementsCount) {
    const newItemsElements = _.drop(itemsElements, oldElementsCount);

    _.each(newItemsElements, element => {
      const $element = $(element);
      const $elementContext = $element.find(streamItemContextSelector);
      const elementTitle = $element.find(streamItemTitleSelector).text();
      const itemModel = _.find(streamItems, item => {
        return (item.track || item.playlist).title === elementTitle;
      });

      const itemType = itemModel.type.replace('-repost', '');
      const itemData = itemModel.track || itemModel.playlist;
      const isRepost = /-repost/.test(itemModel.type);
      const repostBy = isRepost && {
        id: itemModel.user.id,
        name: itemModel.user.username
      };

      $elementContext.append(generateMarkup({
        type: itemType,
        trackId: itemModel.uuid,
        trackBy: {
          id: itemData.user.id,
          name: itemData.user.username
        },
        repostBy
      }));

      console.log(elementTitle);
    });
  }

  function onScriptsLoadded() {}
  // function onStreamsLoadded() {}

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
