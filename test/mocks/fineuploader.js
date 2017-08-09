import $ from 'jquery';
import Promise from 'nbd/Promise';
import FileReader from '../../dom/FileReader';
import image from 'fixtures/dom/FileReader';
  

  function FineUploaderBasic(options) {
    this._options = options;

    // Overriden since FileReader.readAsDataUrl results in broken image data during testing
    FileReader.prototype._read = jasmine.createSpy().and.callFake(function(file) {
      this.reader.onload({
        target: {
          name: file.name,
          type: file.type,
          result: file.data
        }
      });
    });

    // Our fake/pre-uploaded image
    this._blob = { name: image.name, type: image.mime, data: image.result };

    this._buttons = [{
      getInput: function() {
        return $('<input type="file"></input>').html();
      }
    }];
  }

  FineUploaderBasic.prototype = {
    getFile: function() {
      return this._blob;
    },

    cancelAll: function() {},

    getUploads: function() {
      return this._blob ? [this._blob] : [];
    },

    getKey: function() {},

    setParams: function(params) {
      this._params = params;
    },

    reset: function() {
      this._blob = null;
    },

    getFakeImageData: function() {
      return image.result;
    },

    getFakeImageName: function() {
      return this._blob.name;
    },

    /**
     * Fakes a submit
     *
     * @param  {id}
     * @param  {name}
     * @return {Promise}
     */
    fakeSubmit: function(id, name) {
      return this._options.callbacks.onSubmit(id || 0, name || this._blob.name);
    },

    /**
     * Fakes progress
     *
     * @param  {id}
     * @param  {name}
     * @return {Promise}
     */
    fakeProgress: function(id, name, percent, total) {
      this._options.callbacks.onProgress(id || 0, name || this._blob.name, percent || 10, total || 100);
    },

    /**
     * Fakes a submit then a complete. Response may be supplied with an error code to simulate a server-invalid upload
     *
     * @param  {id}
     * @param  {name}
     * @param  {Object} response server response
     * @return {Promise}
     */
    fakeSubmitAndComplete: function(id, name, response) {
      var self = this;

      return new Promise(function(resolve) {
        response = response || {};
        self.fakeSubmit(id, name).then(function() {
          self.fakeComplete(id, name, response);
          resolve();
        });
      });
    },

    /**
     * Fakes a complete. Response may be supplied with an error code to simulate a server-invalid upload
     */
    fakeComplete: function(id, name, response) {
      this._options.callbacks.onComplete(id || 0, name || this._blob.name, response);
    },

    /**
     * Fakes an allComplete. Response may be supplied with an error code to simulate a server-invalid upload
     */
    fakeAllComplete: function() {
      this._options.callbacks.onAllComplete();
    },

    /**
     * Fakes a cancel
     *
     * @param  {id}
     * @param  {name}
     * @return {Promise}
     */
    fakeCancel: function(id, name) {
      var self = this;

      return new Promise(function(resolve) {
        self.fakeSubmit(id, name).then(function() {
          self._options.callbacks.onCancel(id || 0, name || self._blob.name);
          resolve();
        });
      });
    },

    /**
     * Fakes an error
     *
     * @param  {id}
     * @param  {name}
     * @param  {String} [error]
     * @return {Promise}
     */
    fakeValidationError: function(id, name, error) {
      this._options.callbacks.onError(id || 0, name || this._blob.name, error);

      return Promise.resolve();
    },

    /**
     * Fakes an error
     *
     * @param  {id}
     * @param  {name}
     * @param  {String} [error]
     * @param  {Object} [xhr]
     * @return {Promise}
     */
    fakeSubmitAndUploadError: function(id, name, error, xhr) {
      var self = this;

      return new Promise(function(resolve) {
        self.fakeSubmit(id, name).then(function() {
          self._options.callbacks.onError(id || 0, name || self._blob.name, error, xhr);
          resolve();
        });
      });
    },

    /**
     * Fakes a validate batch call
     *
     * @param  {Array} [files]
     */
    fakeValidateBatch: function(files) {
      this._options.callbacks.onValidateBatch(files);
    }
  };

  export default {
    s3: {
      FineUploaderBasic: FineUploaderBasic
    }
  };

