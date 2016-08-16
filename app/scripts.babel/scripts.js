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

  function generateMarkup() {
    const $element = $(`<div class="ss-stream-manger">
      <button class="ss-stream-manger__arrow">▼</button>
      <div class="ss-stream-manger__dropdown">
        <ul class="sc-list-nostyle">
          <li>
            <button>Remove this track</button>
          </li>
          <li>
            <button>Hide all from abbbbbbhjk dhuisa</button>
          </li>
        </ul>
      </div>
    </div>`);

    const $elementToggle = $element.find('.ss-stream-manger__arrow');

    function openDropdown() {
      $elementToggle.parent().addClass('is-open');

      setTimeout(() => {
        $('body').on('click', closeDropdown);
      });
    }

    function closeDropdown() {
      $elementToggle.parent().removeClass('is-open');
      $('body').off('click', closeDropdown);
    }

    $elementToggle.click(openDropdown);

    return $element;
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

      $elementContext.append(generateMarkup());

      console.log(itemModel, elementTitle);
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
