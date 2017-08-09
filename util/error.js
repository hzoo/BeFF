import Promise from 'nbd/Promise';

var handlers = [],
    error = function errorHandler(value) {
      var promise = new Promise();
      promise.reject(value);
      return (this || handlers).reduce(function(chain, handler) {
        return chain.catch(handler);
      }, promise);
    };

Object.defineProperty(error, 'handlers', {
  value: handlers,
});

export default error;

