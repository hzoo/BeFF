import $ from 'jquery';
import async from 'nbd/util/async';
import extend from 'nbd/util/extend';
import View from '../Dialog';
import 'jqueryui/position';
  

  var constructor = View.extend({
    init: function() {
      this._super.apply(this, arguments);
      this.dismiss = function(e) {
        if (e.originalEvent._view !== this) {
          this.hide();
          e.preventDefault();
        }
      }.bind(this);
    },

    dialogData: {
      dialogType: 'menu',
      toolbar: false
    },

    position: function($context, positioning) {
      if (!this.$view) { return; }

      if ($context) {
        this._lastContext = $context;
      }

      var defaultPosition = {
        my: 'left top',
        at: 'left bottom+10',
        of: this._lastContext,
        collision: 'flipfit'
      };

      this.$view.position(extend(defaultPosition, positioning));
    },

    show: function() {
      if (!this.$view) { return; }

      async(function() {
        $('html').on('click touchend', this.dismiss);
      }.bind(this));
      return this._super();
    },

    hide: function() {
      if (!this.$view) { return; }

      $('html').off('click touchend', this.dismiss);
      return this._super();
    }
  });

  export default constructor;

