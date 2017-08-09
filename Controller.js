import $ from 'jquery';
import extend from 'nbd/util/extend';
import log from 'nbd/trait/log';
import responsive from 'nbd/trait/responsive';
import Controller from 'nbd/Controller';
import View from './View';

function isData(id, data) {
  return typeof data === 'undefined' || typeof id === 'object';
}

export default Controller.extend({
  init(id, data) {
    var el, $view;

    if (isData(id, data)) {
      data = id;
      id = undefined;
    }

    if (typeof data === 'string') {
      $view = $(data);
      el = $view[0];
    }

    if (data instanceof $) {
      $view = data;
      el = $view[0];
    }

    if (data instanceof window.Element) {
      el = data;
      $view = $(el);
    }

    if ($view) {
      // We want the HTML5 dataset
      data = extend({}, el.dataset || $view.data());
    }

    this._super(id, data);
    this._view.$view = $view;

    if ($view) {
      this._view.trigger('postrender', $view);
    }
  },
}, {
  VIEW_CLASS: View,
})
  .mixin(log)
  .mixin(responsive);

