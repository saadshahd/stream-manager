const script = document.createElement('script');
script.src = chrome.extension.getURL('scripts/main.js');
(document.head || document.documentElement).appendChild(script);

window.addEventListener('streamMangerBackground', e => {
  console.log(e);
  chrome.runtime.sendMessage(e.detail);
}, false);
