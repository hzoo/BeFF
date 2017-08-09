import $ from 'jquery';
import Component from '../Component';
import 'intersection-observer-polyfill';

export default Component.extend({
  init($elem) {
    this._$elem = $elem;
  },

  bind() {
    this.createObserver();
  },

  createObserver() {
    this._observer = new window.IntersectionObserver(this.changeHandler.bind(this));
    var self = this;

    this._$elem.each(function() {
      self._observer.observe(this);
    });
  },

  changeHandler(changes) {
    var self = this;

    changes.forEach(function(change) {
      var $img = $(change.target);

      self._replaceAttr($img, 'srcset');
      self._replaceAttr($img, 'src');

      self.trigger('load', $img);

      self._observer.unobserve(change.target);
    });
  },

  _replaceAttr($img, attrToReplace) {
    if ($img.attr('data-' + attrToReplace)) {
      $img.attr(attrToReplace, $img.data(attrToReplace))
        .removeAttr('data-' + attrToReplace);
    }
  },

  unbind() {
    this._observer.disconnect();
  },
});

