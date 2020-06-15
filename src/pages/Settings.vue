<template>
    <q-page class="flex justify-center content-center items-center">
        <q-btn class="bg-next-blue1" color="bg-next-blue1" label="Обновление" :loading="submitting" :disable="!isButtonActive" @click="getUpdate">
            <template v-slot:loading>
                <q-spinner />
            </template>
        </q-btn>
        <h3 v-show="errorMessage.length > 0" class="q-pt-lg full-width">{{ errorMessage }}</h3>
    </q-page>
</template>

<script>
    export default {
        name: 'Settings',

        data() {
            return {
                submitting: false,
                isButtonActive: true,
                errorMessage: ''
            }
        },

        methods: {
            getUpdate: function () {
                alert("Зашел в метод")
                this.submitting = true;
                this.isButtonActive = false;
                var _this = this;
                // Apk download by cordova-plugin-file-transfer
                var fileTransfer = new FileTransfer();

                // Get cordova file data directory (app sandbox directory)
                //  > file:///data/user/0/io.cordova.apk.installer.sample/files/
                var sandBoxDirectory = cordova.file.dataDirectory;

                // Apk download path
                // var apkUrl = 'http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=7&ver=1';
                var apkUrl = 'http://192.168.0.104:3000/url';
                // Get file name from apk url;
                // var fileName = apkUrl.match(/[^/]+$/i)[0];
                var fileName = "app-debug.apk"
                fileTransfer.download(
                    apkUrl,
                    sandBoxDirectory + fileName,
                    function(entry) {
                        // Install app
                        apkInstaller.install(fileName, function(msg) {
                            // Start the installer
                            alert("OK")
                            _this.submitting = false;
                            _this.isButtonActive = true;
                        }, function(error) {
                            // Install error
                            alert("Err 1")
                            _this.submitting = false;
                            _this.isButtonActive = true;
                            _this.errorMessage = error
                        });
                    },
                    function(error) {
                        // Download error
                        alert("Err 2")
                        _this.submitting = false;
                        _this.isButtonActive = true;
                        _this.errorMessage = error
                    },
                    false, {}
                );
            }
        }
    }
</script>
