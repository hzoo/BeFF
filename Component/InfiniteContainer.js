import async from 'nbd/util/async';
import extend from 'nbd/util/extend';
import InfiniteLoader from './InfiniteLoader';
import Container from './Container';

export default InfiniteLoader.extend({
  dataKey: 'data',
  offsetKey: 'offset',

  Container,

  init(loaderOptions) {
    this._super();
    extend(this, loaderOptions);
    this._Container = this.Container.extend();
  },

  hasMoreResults(response) {
    var more = !!(response && response[this.offsetKey]);
    if (!more) {
      this.unbind();

      if (this._container.isEmpty()) {
        this.trigger('empty');
      }
    }
    return more;
  },

  getNextOffset(response) {
    return response[this.offsetKey];
  },

  loaded(response) {
    var data = response[this.dataKey];
    this._container.add(data);
  },

  at($context) {
    if (!$context) {
      throw new Error('Context must be defined');
    }

    this._container = this._Container.init($context);

    this.listenTo(this._container, 'update', this.trigger.bind(this, 'update'));

    if ($context.css('overflowX') !== 'visible') {
      this.context = $context[0].id ?
        '#' + $context[0].id :
        this.context;
    }
    return this;
  },

  of(Klass) {
    if (this._container) {
      this._container.Controller = Klass;
      return this;
    }

    this._Container.mixin({
      Controller: Klass,
    });
    return this;
  },

  _xhrOptions() {
    var options = this._super();
    if (this._model) {
      extend(options.data, this._model.data());
    }
    return options;
  },

  bind(model, firstLoad) {
    if (model && model.data) {
      if (this._model) {
        this.stopListening(this._model);
      }

      this._model = model;

      this.listenTo(model, 'all', function reset() {
        if (reset.throttle) { return; }
        reset.throttle = true;
        async(function() {
          this.trigger('reload');
          this.reload();
          if (this._container) {
            this._container.empty();
          }
          reset.throttle = false;
        }.bind(this));
      });
    }

    if (firstLoad) {
      this.reload();
      return this;
    }
    else {
      return this._super();
    }
  },

  destroy() {
    if (this._model) {
      this.stopListening(this._model);
      this._model = null;
    }
    if (this._container) {
      this._container.destroy();
      this._container = null;
    }
    this._super();
  },

  /** @return {Boolean} */
  isEmpty() {
    return this._container && this._container.isEmpty();
  },
});

