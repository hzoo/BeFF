import async from 'nbd/util/async';
import extend from 'nbd/util/extend';
import View from '../View';
import keyboard from '../ux/keyboard';
import transitionEnd from '../dom/transitionEnd';
import dialogTemplate from 'hgn-loader!../template/dialog';


var constructor = View.extend({
  init: function(model) {
    this._super(model);
    this
      .on('postrender', this._bindButtons)
      .on('postrender', function() {
        async(this.position.bind(this));
      });
  },

  destroy: function() {
    this.hide();
    this._super.apply(this, arguments);
  },

  _bindButtons: function($view) {
    $view
      .on('click', '.js-confirm', this.trigger.bind(this, 'confirm'))
      .on('click', '.js-close', this.hide.bind(this))
      .on('click', '.js-disabled', false)
      // "annotate" the event
      .on('click touchend', function(e) {
        e.originalEvent._view = this;
      }.bind(this));
  },

  dialogTemplate: dialogTemplate,

  template: function(data) {
    return this.dialogTemplate(extend({
      content: this._super(data)
    }, this.dialogData, data));
  },

  position: function() {},

  _transitionEnd: function() {
    return transitionEnd(this.$view);
  },

  _shown: false,
  _shownClass: 'shown',

  show: function() {
    if (this._shown) { return this; }
    this._shown = true;

    var $view = this.$view;
    $view.show();
    async(function() {
      $view.toggleClass(this._shownClass, this._shown);
      this.trigger('visible', $view);
    }.bind(this));

    keyboard.on({
      escape: this.hide.bind(this)
    });
    return this.trigger('show', $view);
  },

  hide: function() {
    if (!this._shown) { return this; }
    this._shown = false;

    this._hiding = this._transitionEnd().then(function() {
      if (this.$view) {
        this.$view.hide();
      }
      this.trigger('hidden', this.$view);
    }.bind(this));

    this.$view.toggleClass(this._shownClass, this._shown);

    keyboard.off();
    return this.trigger('hide', this.$view);
  },

  toggle: function() {
    return this[this._shown ? 'hide' : 'show']();
  }
});

export default constructor;

