import Class from 'nbd/Class';
import construct from 'nbd/util/construct';
import log from 'nbd/trait/log';
import pubsub from 'nbd/trait/pubsub';
  

  export default Class.extend({
    bind: function() { return this; },
    unbind: function() { return this; },
    destroy: function() {
      this
      .off()
      .stopListening()
      .unbind();
    }
  }, {
    displayName: 'Component',
    init: function() {
      var self = construct.apply(this, arguments);
      self.bind();
      return self;
    }
  })
  .mixin(log)
  .mixin(pubsub);

