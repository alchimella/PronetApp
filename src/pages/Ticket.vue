<template>
    <q-page class="flex content-between q-pa-md">
        <div class="flex row full-width">
            <div class="flex row justify-between items-start content-start full-width">
                <q-btn class="full-width q-mt-md" color="primary" label="Сканировать" @click="scan" />
                <q-btn class="full-width q-mt-md" color="primary" label="Ввести" @click="prompt = true" />
            </div>
            <q-dialog v-model="prompt" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                        <div class="text-h6">Введите код</div>
                    </q-card-section>

                    <q-card-section>
                        <q-input dense v-model="code" autofocus @keyup.enter="prompt = false" ref="code" :rules="[val => val && val.length > 0 || 'Заполните поле', val => val.length <= 36 || 'Максимальное количество символов 36']" />
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                        <q-btn label="Отмена" color="white" text-color="black" v-close-popup />
                        <q-btn label="Ввод" color="primary" @click="enter" v-close-popup="code" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <div v-if="isActiveSpinner" class="flex justify-center full-width q-mt-xl">
                <q-spinner-puff color="primary" size="3em"/>
            </div>
            <p v-if="isInfo" class="flex justify-center full-width q-mt-xl">{{ message }}</p>
            <p v-if="isError" class="flex justify-center full-width q-mt-xl text-red-6">{{ message }}</p>

            <div v-show="isResult" class="flex row wrap justify-between full-width q-mt-xl">
                <q-card v-for="item in ticket" :key="item._idrref" v-if="parseFloat(item._accumreg1_amount) > 0" @click="getItem(item)" class="col-xs-5 col-sm-5 col-md-5 q-ma-sm q-pa-sm">
                    <q-card-section class="text-overline">{{ item._reference1_code }}</q-card-section>
                    <q-card-section class="flex justify-center text-h4">{{ item._reference14_name }}</q-card-section>
                    <q-card-section class="flex justify-center text-subtitle1">{{ item._accumreg1_amount }}</q-card-section>
                </q-card>
            </div>

            <q-dialog v-model="alert">
                <q-card style="width: 40vh">
                    <q-card-section class="flex justify-center">
                        <div class="text-h5">{{ test._reference14_name }} - {{ test._accumreg1_amount }}</div>
                    </q-card-section>

                    <q-card-section>
                        <q-item-label class="flex justify-center">Вы уверены что хотите списать данный талон?</q-item-label>
                    </q-card-section>

                    <q-card-actions align="between">
                        <q-btn label="Отмена" color="white" text-color="black" @click="isResult = false" v-close-popup />
                        <q-btn label="Ок" color="secondary" @click="deductOfCoupon(test)" v-close-popup="isDeducted" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<script>
    import moment from 'moment'
    import { getCardRequest, buildPackRequest } from '../boot/options';

    export default {
        name: 'Ticket',
        data () {
            return {
                alert: false,
                prompt: false,
                code: '',
                message: '',
                isResult: false,
                ticket: false,
                isActiveSpinner: false,
                isError: false,
                isInfo: false,
                test: '',
                isDeducted: false,
                date: moment().format('YYYY-MM-DD hh:mm:ss')
            }
        },
        methods: {
            scan: function () {
                let _this = this;

                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        let url = _this.checkAuth();

                        _this.post(url, result.text);
                    },
                    function (error) {
                        // alert('Scanning failed: ' + error)
                    },
                    {
                        preferFrontCamera: false, // iOS and Android
                        showFlipCameraButton: true, // iOS and Android
                        showTorchButton: true, // iOS and Android
                        torchOn: false, // Android, launch with the torch switched on (if available)
                        saveHistory: true, // Android, save scan history (default false)
                        prompt: 'Place a barcode inside the scan area', // Android
                        resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                        formats: 'QR_CODE,EAN_8,EAN_13,CODE_128', // default: all but PDF_417 and RSS_EXPANDED
                        orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
                        disableAnimations: true, // iOS
                        disableSuccessBeep: false // iOS and Android
                    }
                )
            },
            enter: async function () {
                console.log('Запушен процесс отправки запроса по талону');

                this.$refs.code.validate();

                if (this.$refs.code.hasError) {
                    this.formHasError = true;
                }

                let url = this.checkAuth();

                this.post(url, this.code);
            },
            getItem: function (item) {
                this.alert = true;

                this.test = item;
            },
            checkAuth: function () {
                let server = localStorage.getItem('server');
                let port = localStorage.getItem('port');

                if (!server || !port) {
                    console.log('Пользователь не авторизирован!');

                    this.isActiveSpinner = false;
                    this.isInfo = true;
                    this.message = 'Необходимо авторизироваться!';

                    return
                }

                this.isActiveSpinner = true;
                this.isResult = false;
                this.isInfo = false;
                this.isError = false;
                this.ticket = false;

                return { server, port }
            },
            post: function (url, code) {
                // let query = 'select * from _reference1 where _name = ' + code;
                let envelope = getCardRequest(code);

                if (code) {
                    let options = {
                        method: 'post',
                        url: 'http://' + url.server + ':' + url.port,
                        data: envelope
                    };

                    this.$axios(options)
                        .then(response => {
                            console.log('response: ', response);

                            let data = response.data.envelope.body.response.data;

                            if (data.length) {
                                console.log('Найден талон с номером - ' + code, data);

                                this.isResult = true;
                                this.code = '';
                                this.ticket = data;
                                this.isActiveSpinner = false;
                            } else {
                                console.log('Талонов с кодом - ' + code + ' не найдено!');

                                this.isActiveSpinner = false;
                                this.isInfo = true;
                                this.message = 'Совпадений не найдено!'
                            }
                        })
                        .catch(err => {
                            console.log('Произошла ошибка при поиске талона: ', err);

                            this.isActiveSpinner = false;
                            this.isError = true;
                            this.message = 'Произошла ошибка при поиске талона!'
                        })
                }
            },

            deductOfCoupon: function (item) {
                let server = localStorage.getItem('server');
                let port = localStorage.getItem('port');
                this.$q.loading.show({
                    delay: 400 // ms
                });

                console.log('FLOAT: ', parseFloat(item._accumreg1_amount));

                let params = {
                    date: moment().format('YYYY-MM-DD hh:mm:ss'),
                    _reference1_idrref: item._reference1_idrref,
                    _reference14_idrref: item._reference14_idrref,
                    _reference13_idrref: localStorage.getItem('deviceId').toLowerCase(),
                    amount: parseFloat(item._accumreg1_amount)
                };

                console.log('params: ', params);

                let envelope = buildPackRequest(params);
                let options = {
                    method: 'post',
                    url: 'http://' + server + ':' + port,
                    data: envelope
                };

                this.$axios(options)
                    .then(res => {
                        console.log('RES: ', res);

                        this.isDeducted = true;
                        this.$router.push('/');
                        this.$q.loading.hide()
                    })
                    .catch(err => {
                        console.log('Произошла ошибка при списании талона: ', err);

                        this.isActiveSpinner = false;
                        this.isError = true;
                        this.message = 'Произошла ошибка при списании талона!'
                    })
            }
        }
    }
</script>

<style scoped>

</style>
