import Component from '../Component';
import loadScriptPromised from 'tiny-script-loader/loadScriptPromised';

export default Component.extend({
  init(pixelId) {
    this._pixelId = pixelId;
  },

  bind() {
    this._createTwitterWrapper();

    this._loadingPromise = this._load()
      .then(function() {
        this._twitter('init', this._pixelId);
      }.bind(this));
  },

  trackPageView() {
    return this._loadingPromise.then(function() {
      this._twitter('track', 'PageView');
    }.bind(this));
  },

  _twitter() {
    if (window.twq) {
      window.twq.apply(window.twq, arguments);
    }
  },

  _load() {
    return loadScriptPromised('//static.ads-twitter.com/uwt.js');
  },

  _createTwitterWrapper() {
    if (window.twq) { return; }

    window.twq = function() {
      var twitter = window.twq;

      if (twitter.exe) {
        twitter.exe.apply(twitter, arguments);
      }
      else {
        twitter.queue.push(arguments);
      }
    };

    window.twq.version = '1';
    window.twq.queue = [];
  },
});

