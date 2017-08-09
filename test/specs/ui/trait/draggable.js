import extend from 'nbd/util/extend';
import draggable from 'ui/trait/draggable';
  

  describe('ui/trait/draggable', function() {
    beforeEach(function() {
      this._$view = affix('div');

      this.view = extend({
        $view: this._$view
      }, draggable);
    });

    it('sets the default options', function() {
      this.view.makeDraggable();

      expect(this.view.$view.draggable('option', 'handle')).toEqual('.js-drag-handle');
      expect(this.view.$view.draggable('option', 'containment')).toEqual('window');
      expect(this.view.$view.draggable('option', 'cancel')).toEqual('input,textarea,button,select,option, .js-drag-cancel');
    });

    it('sets the specified options', function() {
      var $altView = affix('div');

      this.view.makeDraggable($altView, '.test-handle', '.test-containment', '.test-cancel');

      expect($altView.draggable('option', 'handle')).toEqual('.test-handle');
      expect($altView.draggable('option', 'containment')).toEqual('.test-containment');
      expect($altView.draggable('option', 'cancel')).toEqual('input,textarea,button,select,option, .test-cancel');
    });

    it('allows a user to nullify the handle option', function() {
      this.view.makeDraggable(this._$view, '');

      expect(this.view.$view.draggable('option', 'handle')).toEqual('');
    });
  });

