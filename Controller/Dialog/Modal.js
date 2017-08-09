import promise from 'nbd/trait/promise';
import Dialog from '../Dialog';
import Popup from '../../View/Dialog/Popup';
import throttle from 'nbd/util/throttle';
  

  var Modal = Dialog.extend({
    switchView: function() {
      this._super.apply(this, arguments);
      this.listenTo(this._view, {
        confirm: function() {
          this.confirm.apply(this, arguments);
        },
        hide: function() {
          this.cancel.apply(this, arguments);
        }
      });
    },

    /**
     * Function expected to generate a Promise
     * @abstract
     * @returns Promise delays dialog close until resolved
     */
    promiseGenerator: undefined,

    confirm: function() {
      this.resolve();
    },

    cancel: function() {
      this.reject();
    }
  }, {
    VIEW_CLASS: Popup,

    init: function(options, promiseGenerator) {
      var dialog = new this(options),
          destroy = dialog.destroy.bind(dialog);
      promiseGenerator = promiseGenerator || dialog.promiseGenerator;

      function resolveGenerator() {
        var retval = promiseGenerator.call(dialog);
        if (retval && typeof retval.then === 'function') {
          retval.then(dialog.resolve.bind(dialog));
        }
        else {
          dialog.resolve(retval);
        }
        return retval;
      }

      if (typeof promiseGenerator === 'function') {
        dialog.confirm = function() {
          throttle(resolveGenerator);
        };
      }

      dialog.toggle(document.body);
      dialog.then(destroy, destroy);
      return dialog;
    }
  })
  .mixin(promise);

  export default Modal;

