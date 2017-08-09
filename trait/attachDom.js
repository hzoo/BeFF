import $ from 'jquery';

var _attachTextLike = function(selector, key, $field) {
  var model;

  $field = $field.is(selector) ?
    $field :
    $field.find(selector);

  model = this.on(key, function(value) {
    this._setElementValue($field, value);
  });

  $field.on('change', function(e) {
    model.set(key, $.trim(e.target.value));
  });
};

// Two-way binding of inputs to a model
export default {
  attach($els) {
    var map = {
      'input[type=text]': 'attachText',
      'input[type=radio]': 'attachRadio',
      'input[type=checkbox]': 'attachCheckbox',
      textarea: 'attachTextArea',
      select: 'attachSelect',
    };

    $els.each(function(i, el) {
      Object.keys(map).some(function(selector) {
        var $el = $(el),
            matches = $el.is(selector);
        if (matches) {
          this[map[selector]](el.name, $el);
        }
        return matches;
      }, this);
    }.bind(this));
  },

  attachCheckbox(key, $context) {
    var $checkboxes = $context.find('input[type=checkbox]'),
        model = this.on(key, function(piped) {
          var values = piped.split('|');

          $checkboxes.each(function(index, el) {
            var checked = !!~values.indexOf(el.value);
            this._setElementChecked(el, checked);
          }.bind(this));
        });

    $context.on('change', 'input[type=checkbox]', function() {
      var piped = $checkboxes
        .filter(':checked').toArray()
        .map(function(el) {
          return el.value;
        })
        .join('|');

      model.set(key, piped);
    });

    return this;
  },

  attachRadio(key, $context) {
    var $radios = $context.find('input[type=radio]'),
        model = this.on(key, function(value) {
          this._setElementChecked($radios.filter('[value="' + value + '"]'), true);
        });

    $context.on('change', 'input[type=radio]', function() {
      model.set(key, this.value);
    });

    return this;
  },

  attachSelect(key, $field) {
    $field = $field.is('select') ?
      $field :
      $field.find('select');

    var model = this.on(key, function(value) {
      this._setElementValue($field, value);
    });

    $field.on('change', function() {
      model.set(key, this.value);
    });

    return this;
  },

  attachTextArea(key, $field) {
    _attachTextLike.call(this, 'textarea', key, $field);
    return this;
  },

  attachText(key, $field) {
    _attachTextLike.call(this, 'input[type=text]', key, $field);
    return this;
  },

  attachSearch(key, $field) {
    _attachTextLike.call(this, 'input[type=search]', key, $field);
    return this;
  },

  attachEmail(key, $field) {
    _attachTextLike.call(this, 'input[type=email]', key, $field);
    return this;
  },

  attachUrl(key, $field) {
    _attachTextLike.call(this, 'input[type=url]', key, $field);
    return this;
  },

  attachTel(key, $field) {
    _attachTextLike.call(this, 'input[type=tel]', key, $field);
    return this;
  },

  attachPassword(key, $field) {
    _attachTextLike.call(this, 'input[type=password]', key, $field);
    return this;
  },

  _setElementValue($el, val) {
    $($el).val(val);
  },

  _setElementChecked($el, checked) {
    $($el).prop('checked', checked);
  },
};

