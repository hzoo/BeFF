/**
 * Module wrapper around usage of the CSRF token stored in the cookie store
 */
import cookie from './cookie';
import uuidV4 from 'uuid/v4';

/**
   * Sets the CSRF cookie to a random value. Calling multiple times will
   * set the cookie to a new value
   */
function genCookie() {
  cookie.set('bcp', uuidV4(), { path: '/', expires: 1 });
  return cookie.get('bcp');
}

/**
   * Expire the CSRF cookie to remove it from the browser's cookie store
   *
   * NOTE: Added for completeness, as there is currently nowhere that
   *       needs to manually expire the token.
   */
function expireCookie() {
  cookie.set('bcp', null);
}

/**
   * Returns the current value of the CSRF token stored in the browser's cookie
   * store.
   *
   * @return {String}
   */
function getCookie() {
  return cookie.get('bcp') || genCookie();
}

export default {
  get: getCookie,
  expire: expireCookie,
};

