import pubsub from 'nbd/trait/pubsub';
import construct from 'nbd/util/construct';
import extend from 'nbd/util/extend';
import Component from '../Component';
import scrollfloat from '../ux/scrollfloat';
import xhr from '../util/xhr';
  

  export default Component.extend({
    init: function(context, offset, contentContext) {
      this.context = context || 'window';
      this.contentContext = contentContext;
      this.resetParams(offset);
    },

    breakpoint: 1,
    offsetKey: 'offset',
    offset: 0,
    data: {},
    url: undefined,
    type: 'GET',

    _infinitescroll: scrollfloat,
    _xhr: xhr,

    hasMoreResults: function(/* response */) {
      throw "InfiniteLoader requires a 'hasMoreResults(response)' function. Please extend and implement.";
    },

    getNextOffset: function(/* response */) {
      throw "InfiniteLoader requires a 'getNextOffset(response)' function. Please extend and implement.";
    },

    loaded: function(/* response */) {
      throw "InfiniteLoader requires a 'loaded(response)' function. Please extend and implement.";
    },

    resetParams: function(offset, data, url) {
      delete this.offset;
      delete this.data;
      return this.setParams(offset, data, url);
    },

    setParams: function(offset, data, url) {
      if (offset != null) {
        this.offset = offset;
      }
      if (data != null) {
        this.data = data;
      }
      if (url != null) {
        this.url = url;
      }
      return this;
    },

    bind: function() {
      if (this._boundLoad) {
        return this;
      }

      this._boundLoad = this.load.bind(this);
      this._infinitescroll(this.breakpoint, this._boundLoad, this.context, this.contentContext);
      return this;
    },

    _stop: function() {
      if (this._request) {
        this._request.abort();
      }
    },

    unbind: function() {
      if (!this._boundLoad) {
        return;
      }

      this._infinitescroll.off(this._boundLoad, this.context, this.contentContext);
      delete this._boundLoad;
      return this;
    },

    load: function() {
      this.trigger('before');

      this._request = this._xhr(this._xhrOptions());
      // Need to split up the chain at this point
      var chain = this._request.then(this.loaded.bind(this));

      // Event out only the relevant events
      chain.then(
        this.trigger.bind(this, 'success'),
        this.trigger.bind(this, 'error')
      );

      return this._request
      .then(this._trackState.bind(this))
      .then(function() {
        // Rejoin original chain
        return chain;
      });
    },

    _xhrOptions: function() {
      var data = typeof this.data === 'function' ? this.data() : this.data;

      data = extend({}, data);
      data[this.offsetKey] = this.offset;

      return {
        url: this.url,
        type: this.type,
        data: data
      };
    },

    _trackState: function(response) {
      this.offset = this.getNextOffset(response);

      if (!this.hasMoreResults(response)) {
        throw 'No more results';
      }
      return response;
    },

    reload: function(offset, data, url) {
      this.resetParams(offset, data, url);
      this._stop();
      this.unbind();
      // Make the initial request after the reset
      var request = this.load();
      request.then(this.bind.bind(this));
      return request;
    }
  })
  .mixin(pubsub);

