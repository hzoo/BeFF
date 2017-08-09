import $ from 'jquery';
import View from 'nbd/View';
import log from 'nbd/trait/log';
import eventMappable from './trait/eventMappable';

export default View.extend({
  init() {
    this._super.apply(this, arguments);
    this.on('postrender', this._mapEvents);
  },

  template(templateData) {
    return this.mustache && this.mustache(templateData, this.partials);
  },

  destroy() {
    this._undelegateEvents();
    this._super();
  },
}, {
  domify: $,
})
  .mixin(log)
  .mixin(eventMappable);

