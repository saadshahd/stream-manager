export default function (callback) {
  (function (send) {
    XMLHttpRequest.prototype.send = function (data) {
      send.call(this, data);
      this.addEventListener('load', e => {
        callback(e.target);
      });
    };
  })(XMLHttpRequest.prototype.send);
}
