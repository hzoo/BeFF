import pubsub from 'nbd/trait/pubsub';
import extend from 'nbd/util/extend';
import Component from '../Component';
import scrollfloat from '../ux/scrollfloat';
import xhr from '../util/xhr';

export default Component.extend({
  init(context, offset, contentContext) {
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

  hasMoreResults(/* response */) {
    throw "InfiniteLoader requires a 'hasMoreResults(response)' function. Please extend and implement.";
  },

  getNextOffset(/* response */) {
    throw "InfiniteLoader requires a 'getNextOffset(response)' function. Please extend and implement.";
  },

  loaded(/* response */) {
    throw "InfiniteLoader requires a 'loaded(response)' function. Please extend and implement.";
  },

  resetParams(offset, data, url) {
    delete this.offset;
    delete this.data;
    return this.setParams(offset, data, url);
  },

  setParams(offset, data, url) {
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

  bind() {
    if (this._boundLoad) {
      return this;
    }

    this._boundLoad = this.load.bind(this);
    this._infinitescroll(this.breakpoint, this._boundLoad, this.context, this.contentContext);
    return this;
  },

  _stop() {
    if (this._request) {
      this._request.abort();
    }
  },

  unbind() {
    if (!this._boundLoad) {
      return;
    }

    this._infinitescroll.off(this._boundLoad, this.context, this.contentContext);
    delete this._boundLoad;
    return this;
  },

  load() {
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

  _xhrOptions() {
    var data = typeof this.data === 'function' ? this.data() : this.data;

    data = extend({}, data);
    data[this.offsetKey] = this.offset;

    return {
      url: this.url,
      type: this.type,
      data,
    };
  },

  _trackState(response) {
    this.offset = this.getNextOffset(response);

    if (!this.hasMoreResults(response)) {
      throw 'No more results';
    }
    return response;
  },

  reload(offset, data, url) {
    this.resetParams(offset, data, url);
    this._stop();
    this.unbind();
    // Make the initial request after the reset
    var request = this.load();
    request.then(this.bind.bind(this));
    return request;
  },
})
  .mixin(pubsub);

