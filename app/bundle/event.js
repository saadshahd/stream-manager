const nameSpace = 'StreamManger';

function getType(name) {
  return `${nameSpace}:${name}`;
}

export function emit(name, detail) {
  const type = getType(name);
  window.postMessage({type, detail}, '*');
}

export function on(name, handler) {
  window.addEventListener('message', ({source, data: {type, detail}}) => {
    if (source !== window) return;
    if (type === getType(name)) handler(detail);
  }, false);
}
