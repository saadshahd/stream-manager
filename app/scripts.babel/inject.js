const script = document.createElement('script');
script.src = chrome.extension.getURL('scripts/scripts.js');
(document.head || document.documentElement).appendChild(script);
