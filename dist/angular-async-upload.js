(function(){
  'use strict';

  angular.module('platanus.asyncUpload', ['ngFileUpload']);

})();

(function(){

angular
  .module('platanus.asyncUpload')
  .directive('asyncUpload', asyncUpload);

function asyncUpload(Upload, trashIcon) {
  var directive = {
    template:
      '<div class="async-upload">' +
        '<div class="upload-btn" ' +
          'ngf-change="upload($files)" ' +
          'ngf-select ' +
          'ngf-multiple="multiple" ' +
          'ng-model="files"> ' +
          '<button>{{ getButtonLabel() }}</button> ' +
        '</div>' +
        '<img class="remove-btn" ' +
          'ng-src="{{ trashIcon }}" ' +
          'ng-click="onRemoveUpload()" ' +
          'ng-hide="emptyIdentifier() || isLoading()" />' +
      '</div>',
    require: 'ngModel',
    scope: {
      uploadUrl: '@',
      buttonLabel: '@',
      multiple: '@',
      initCallback: '&',
      startCallback: '&',
      successCallback: '&',
      progressCallback: '&',
      errorCallback: '&',
      removeCallback: '&',
      doneCallback: '&'
    },
    link: link,
  };

  return directive;

  function link(_scope, _element, _attrs, _controller) {
    var NO_PROCESSING = -1,
        ALL_FILES_PROCESSED = 0;

    _scope.processedFilesCount = NO_PROCESSING;
    _scope.multiple = false;
    _scope.upload = upload;
    _scope.getButtonLabel = getButtonLabel;
    _scope.trashIcon = trashIcon;
    _scope.onRemoveUpload = onRemoveUpload;
    _scope.emptyIdentifier = emptyIdentifier;
    _scope.isLoading = isLoading;

    _scope.$watch('processedFilesCount', function(_count) {
      if(_count === ALL_FILES_PROCESSED) {
        _scope.processedFilesCount = NO_PROCESSING;
        (_scope.doneCallback || angular.noop)();
      }
    });

    _scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;

      if(phase === '$apply' || phase === '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    function uploadFile(_remainginFiles) {
      var file = _remainginFiles.shift();

      if(!file) {
        return;
      }

      var params = {
        url: _scope.uploadUrl,
        file: file
      };

      (_scope.startCallback || angular.noop)({ file: { localFileName: file.name } });

      Upload.upload(params).success(function(data) {
        var successData = (data.upload || data),
            progressData = { localFileName: file.name, loaded: 1, total: 1 };

        setIdentifier(successData.identifier);
        successData.localFileName = file.name;
        _scope.processedFilesCount--;

        (_scope.progressCallback || angular.noop)({ event: progressData });
        (_scope.successCallback || angular.noop)({ uploadData: successData });

      }).progress(function(event){
        var progressData = { localFileName: file.name, loaded: (event.loaded * 0.95), total: event.total };
        (_scope.progressCallback || angular.noop)({ event: progressData });

      }).error(function(data, status) {
        var progressData = { localFileName: file.name, loaded: 1, total: 1 },
            errorData = { localFileName: file.name, error: data, status: status };

        console.error(errorData);
        _scope.processedFilesCount--;

        (_scope.progressCallback || angular.noop)({ event: progressData });
        (_scope.errorCallback || angular.noop)({ errorData: errorData });
      });

      uploadFile(_remainginFiles);
    }

    function setIdentifier(_identifier) {
      if(!_identifier) {
        _controller.$setViewValue(null);
        return;
      }

      if(!!_scope.multiple) {
        var identifiers = _controller.$viewValue || [];
        identifiers.push(_identifier);
        _controller.$setViewValue(identifiers);
        return;
      }

      _controller.$setViewValue(_identifier);
    }

    function upload(files) {
      _scope.safeApply(function() {
        if (!files || !files.length) return;

        if(!_scope.multiple) {
          files = [files[0]];
        }

        setIdentifier(null);
        _scope.processedFilesCount = files.length;
        (_scope.initCallback || angular.noop)();

        uploadFile(files);
      });
    }

    function getButtonLabel() {
      return (_scope.buttonLabel || 'Select file...');
    }

    function onRemoveUpload() {
      (_scope.removeCallback || angular.noop)();
      setIdentifier(null);
    }

    function emptyIdentifier() {
      return !_controller.$viewValue;
    }

    function isLoading() {
      return _scope.processedFilesCount > ALL_FILES_PROCESSED;
    }
  }
}

asyncUpload.$inject = ['Upload', 'trashIcon'];

})();

(function() {
  'use strict';

  angular
    .module('platanus.asyncUpload')
    .constant('trashIcon', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAqCAQAAADhEEisAAAAAmJLR0QA/4eP\nzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQffCRQUHjb9AwcJAAAB\nwElEQVRIx+3Wv2sUQRQH8M/snZ4iiWIUsVJQbCJCasH8Cf5ABEGwsrBQ0MbO\nRgT/CAU7CVhY2QiKcAixEQvBKiBGLnB3CRHPQO4ua+He7a7snndaiXkDM7xh\nvvPefvc784Yim/ZEUztpLXUnC9cJhbP3XdPSy6xacrZoYbUQ/tK7DBj6grg8\n+l6zapn5eESmfUuW06ld7rmqom98q7vlE0HkqTPaNgojllnFd+esRC6a19AR\nJ/DR/WDsqblJ5Lz2LzSNa/Oiqude2/JnVv3J5ox9EwI3fU7/+23XJyKOj06n\n8FhDdyJ4I6+6WCwW+E2feiDK7dm1YDHjL1rIZLXi8UBtxZp/5oGKV6bAmht6\ndrgwPEh1dY+yLEU5la+jP+Tjmx62VBNJreOrqaHAcvCQEWTWD0lL8814kb+y\naukRjUuPb+G3hxH3UCjztpPfTv5/S/6fpm5SeCiDxziGgw4l/oz9mE2qAMdx\nKqkIud3uuqQrFqw6qqaZFIMNkROW9ZMt2uas6eCDK2n0t8McDtjUGnq7Tfsy\nfHVEDmvqgPfZ6MFDcxMwsOqyZnqn88IeR+wcA9r1xp1BiQw5GmtjwTNvkR//\nn52kKbQ1VwAAAABJRU5ErkJggg==\n');
})();
