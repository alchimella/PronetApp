cordova.define("cordova-plugin-apkInstaller.apkInstaller", function(require, exports, module) {
var exec = require('cordova/exec');

module.exports = {
    install: function(fileName, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "apkInstaller", "install", [fileName]);
    }
};

});
