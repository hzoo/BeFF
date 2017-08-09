import Promise from 'nbd/Promise';
import promisesFacade from './promises';
  export default function(Uploader, options, files) {
    return promisesFacade(Uploader, options, files)
    .then(function(uploadPromises) {
      return Promise.all(uploadPromises);
    });
  };

