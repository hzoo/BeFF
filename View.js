import $ from 'jquery';
import View from 'nbd/View';
import log from 'nbd/trait/log';
import eventMappable from './trait/eventMappable';


export default View.extend({
  init: function() {
    this._super.apply(this, arguments);
    this.on('postrender', this._mapEvents);
  },

  template: function(templateData) {
    return this.mustache && this.mustache(templateData, this.partials);
  },

  destroy: function() {
    this._undelegateEvents();
    this._super();
  }
}, {
  domify: $
})
  .mixin(log)
  .mixin(eventMappable);

