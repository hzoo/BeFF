import Class from 'nbd/Class';
import construct from 'nbd/util/construct';
import log from 'nbd/trait/log';
import pubsub from 'nbd/trait/pubsub';

export default Class.extend({
  bind() { return this; },
  unbind() { return this; },
  destroy() {
    this
      .off()
      .stopListening()
      .unbind();
  },
}, {
  displayName: 'Component',
  init() {
    var self = construct.apply(this, arguments);
    self.bind();
    return self;
  },
})
  .mixin(log)
  .mixin(pubsub);

