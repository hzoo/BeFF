import $ from 'jquery';
import Promise from 'nbd/Promise';
import csrfCookie from './csrfCookie';
  

  function addCsrfToken(options) {
    var addCsrf = function(req) {
          req.setRequestHeader('X-BCP', csrfCookie.get());
        },
        originalBeforeSend;

    if (!options.beforeSend) {
      options.beforeSend = addCsrf;
    }
    else {
      originalBeforeSend = options.beforeSend;
      options.beforeSend = function(req) {
        originalBeforeSend(req);
        addCsrf(req);
      };
    }

    return options;
  }

  /**
  * Returns a promise wrapping jQuery.ajax()
  * This is so we can get proper error reporting
  */
  export default function xhr(options) {
    var thenable,
        p = new Promise(),
        req;

    if (typeof options === 'string') {
      options = { url: options };
    }

    if (!options.crossDomain) {
      options = addCsrfToken(options);
    }

    req = $.ajax(options);
    p.resolve(req);

    thenable = p.thenable();
    thenable.abort = req.abort;
    return thenable;
  };

