import $ from 'jquery';
import Class from 'nbd/Class';
  

  function checkMeta(metas, fn) {
    return function(e) {
      // Passes if all the metakeys pass
      var pass = metas.map(function(m) {
        return m ? m.toLowerCase() + 'Key' : null;
      }).reduce(function(p, n) {
        return p && (n ? e.originalEvent[n] : true);
      }, true);

      if (pass) {
        return fn.call(this, e);
      }
    };
  }

  var keyhandler = new (Class.extend({
    listeners: null,
    globals: null,

    ignoredElements: {
      INPUT: true,
      TEXTAREA: true
    },

    init: function(options) {
      options = options || {};
      this.globals = options.global || {};
      this.listeners = [];
      this.ignoredElements = $.extend({}, this.ignoredElements);

      this.addListener = this.addListener.bind(this);
      this.appendListener = this.appendListener.bind(this);
      this.removeListener = this.removeListener.bind(this);
      this.addGlobal = this.addGlobal.bind(this);
      this.keydownHandler = this.keydownHandler.bind(this);

      $(document.body).on('keydown', this.keydownHandler);
    },

    destroy: function() {
      $(document.body).off('keydown', this.keydownHandler);
    },

    translate: function(keymap, map) {
      var metaRE = /^((?:(?:meta|shift|ctrl|alt)-)*)(.+)$/i;
      map = map || {};

      Object.keys(keymap).forEach(function(key) {
        var result = metaRE.exec(key);
        if (!result) { return; }
        // result[2] is the actual key
        var keyCode = this.constructor.keyCodes[result[2].toLowerCase()];
        if (!keyCode) { return; }
        map[keyCode] = map[keyCode] || $.Callbacks('unique stopOnFalse');
        // result[1] is the meta modifiers
        map[keyCode].add(result[1] ? checkMeta(result[1].split('-'), keymap[key]) : keymap[key]);
      }, this);

      return map;
    },

    addListener: function(map) {
      this.listeners.push(this.translate(map));
    },

    appendListener: function(map) {
      if (!this.listeners.length) {
        this.listeners.push({});
      }
      this.translate(map, this.listeners[this.listeners.length - 1]);
    },

    removeListener: function() {
      this.listeners.pop();
    },

    addGlobal: function(map) {
      this.translate(map, this.globals);
    },

    keydownHandler: function keydown(e) {
      var topMap = this.listeners.length ? this.listeners[this.listeners.length - 1] : {};

      if (!(topMap.hasOwnProperty(e.which) || this.globals.hasOwnProperty(e.which))) {
        return;
      }

      // execute the top handler, if any
      if (topMap[e.which] && (this.constructor.bypassCodes[e.which] || !this.ignoredElements[e.target.tagName])) {
        topMap[e.which].fire(e);
      }

      // execute global handler
      if (this.globals[e.which]) {
        this.globals[e.which].fire(e);
      }
    },

    keyupHandler: function keyup() {}
  }, {
    keyCodes: {
      backspace: 8,
      tab: 9,
      enter: 13,
      shift: 16,
      ctrl: 17,
      alt: 18,
      pause: 19,
      capslock: 20,
      escape: 27,
      pageup: 33,
      pagedown: 34,
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      insert: 45,
      delete: 46,
      0: 48,
      1: 49,
      2: 50,
      3: 51,
      4: 52,
      5: 53,
      6: 54,
      7: 55,
      8: 56,
      9: 57,
      a: 65,
      b: 66,
      c: 67,
      d: 68,
      e: 69,
      f: 70,
      g: 71,
      h: 72,
      i: 73,
      j: 74,
      k: 75,
      l: 76,
      m: 77,
      n: 78,
      o: 79,
      p: 80,
      q: 81,
      r: 82,
      s: 83,
      t: 84,
      u: 85,
      v: 86,
      w: 87,
      x: 88,
      y: 89,
      z: 90,
      f1: 112,
      f2: 113,
      f3: 114,
      f4: 115,
      f5: 116,
      f6: 117,
      f7: 118,
      f8: 119,
      f9: 120,
      f10: 121,
      f11: 122,
      f12: 123,
      ';': 186,
      '=': 187,
      ',': 188,
      '-': 189,
      '.': 190,
      '/': 191,
      '`': 192,
      '[': 219,
      '\\': 220,
      ']': 221,
      '\'': 222
    },

    bypassCodes: {
      16: true,
      17: true,
      18: true,
      19: true,
      20: true,
      27: true,
      45: true,
      112: true,
      113: true,
      114: true,
      115: true,
      116: true,
      117: true,
      118: true,
      119: true,
      120: true,
      121: true,
      122: true,
      123: true
    }
  }))();

  export default {
    on: keyhandler.addListener,
    off: keyhandler.removeListener,
    add: keyhandler.appendListener,
    global: keyhandler.addGlobal
  };

