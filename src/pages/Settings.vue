<template>
    <q-page class="flex justify-center content-center items-center">
        <div class="justify-center full-width">CURRENT VERSION - {{verCounter}}</div>
        <q-btn v-if="!isDownloadButtonActive" class="bg-next-blue1" color="bg-next-blue1" label="Проверить обновление" :loading="submitting" :disable="!isButtonActive" @click="checkUpdate">
            <template v-slot:loading>
                <q-spinner />
            </template>
        </q-btn>
        <q-btn v-else class="bg-next-blue1" color="bg-next-blue1" label="Скачать" :loading="submitting" :disable="!isButtonActive" @click="getUpdate">
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
                isDownloadButtonActive: false,
                errorMessage: '',
                verCounter: localStorage.appVersion,
                ver: ''
            }
        },

        methods: {
            checkUpdate: function () {
                this.errorMessage = '';
                this.submitting = true;
                this.isButtonActive = false;

                let options = {
                    method: 'post',
                    url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=8`
                };

                this.$axios(options)
                    .then(response => {
                        console.log('Проверка версий приложения на сервере прошла успешно', response);
                        let currentVersion = this.$config.userCurrentAppVersion
                        let data = response.data.envelope.body.response.data;

                        if (data[0] && data[0]['_ver'] > currentVersion) {
                            console.warn(data)

                            this.ver = data[0]['_ver']
                            this.isDownloadButtonActive = true
                            this.errorMessage = 'Доступна новая версия приложения'
                        } else {
                            this.errorMessage = 'Новой версии приложения нет'
                        }

                        this.submitting = false;
                        this.isButtonActive = true;
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при проверке версии на сервере: ', JSON.stringify(err));

                        this.errorMessage = 'Произошла ошибка при соединении с сервером';
                        this.submitting = false;
                        this.isButtonActive = true;
                    });
            },
            getUpdate: function () {
                this.submitting = true;
                this.isButtonActive = false;
                var _this = this;
                // Apk download by cordova-plugin-file-transfer
                var fileTransfer = new FileTransfer();

                // Get cordova file data directory (app sandbox directory)
                //  > file:///data/user/0/io.cordova.apk.installer.sample/files/
                var sandBoxDirectory = cordova.file.dataDirectory;

                // Apk download path
                var apkUrl = 'http://pn.pronet.kg:1072/update/';
                // Get file name from apk url;
                var fileName = "ver_2.apk"
                fileTransfer.download(
                    apkUrl,
                    sandBoxDirectory + fileName,
                    function(entry) {
                        // Install app
                        apkInstaller.install(fileName, function(msg) {
                            // Start the installer
                            _this.submitting = false;
                            _this.isButtonActive = true;
                            _this.errorMessage = ''
                            localStorage.appVersion = _this.ver
                            // _this.$config.userCurrentAppVersion = _this.verCounter
                            _this.verCounter = _this.$config.userCurrentAppVersion
                        }, function(error) {
                            // Install error
                            _this.submitting = false;
                            _this.isButtonActive = true;
                            _this.errorMessage = error
                        });
                    },
                    function(error) {
                        // Download error
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
