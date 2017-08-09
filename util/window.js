import deparam from 'nbd/util/deparam';

/**
   * Used for spying purposes within tests
   */
export default {
  /**
     * Gets the origin of the window (e.g. https://example.com:1234)
     *
     * @return {string}
     */
  getOrigin() {
    return window.location.protocol + '//' + window.location.host;
  },

  /**
     * Gets value out of window.location
     *
     * @param {string} key
     *
     * @return {string|Object}
     */
  getLocation(key) {
    if (!key) {
      return window.location;
    }

    return window.location[key];
  },

  /**
     * Calls window.open
     *
     * @return {Window}
     */
  open() {
    return window.open.apply(window, arguments);
  },

  /**
     * Is the current window an iframe
     *
     * @return {Boolean}
     */
  isIframe() {
    return window.top !== window;
  },

  /**
     * sets the window.location
     *
     * @param {string} location
     */
  setLocation(location) {
    window.location.assign(location);
  },

  /**
     * calls window.location
     *
     * @param {string} location
     */
  replaceLocation(location) {
    window.location.replace(location);
  },

  /** Reloads the current page */
  reloadLocation() {
    window.location.reload();
  },

  /** @return {String} */
  getProtocol() {
    return window.location.protocol;
  },

  /** @return {String} */
  getPath() {
    var loc = window.location;
    return loc.pathname + loc.search + loc.hash;
  },

  /**
     * Gets object representation of window.location.search
     *
     * @return {Object}
     */
  getSearchObject() {
    var search = this.getLocation('search');

    if (!search) {
      return {};
    }

    // Remove initial question mark
    search = search.substr(1);

    return deparam(search);
  },
};

