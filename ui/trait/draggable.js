import 'jqueryui/draggable';
  
  export default {
    makeDraggable: function($view, handle, containment, cancelSelector) {
      var cancelDefault;

      $view = $view || this.$view;
      handle = handle === undefined ? '.js-drag-handle' : handle;
      containment = containment || 'window';
      cancelSelector = cancelSelector || '.js-drag-cancel';

      $view.draggable({
        handle: handle,
        containment: containment
      });

      cancelDefault = $view.draggable('option', 'cancel');
      $view.draggable('option', 'cancel', cancelDefault + ', ' + cancelSelector);
      return $view;
    }
  };

