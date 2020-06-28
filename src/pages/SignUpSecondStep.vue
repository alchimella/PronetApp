<template>
    <q-page class="flex q-pa-lg">
        <div class="flex row justify-center content-center full-width">
            <img class="l-logo" src="../assets/logo.png" />
        </div>
        <div class="flex row justify-center content-start full-width">
            <h1 class="flex justify-center full-width">Мы отправили SMS код на номер</h1>
            <h2>+996 (000) 000 000</h2>
            <h3>Введите полученный код, чтобы подтвердить Ваш номер</h3>

            <div class="flex row justify-center full-width l-pin-code">
                <label class="flex justify-center content-center items-center otp-label">{{ t1 }}</label>
                <label class="flex justify-center content-center items-center q-ml-sm otp-label">{{ t2 }}</label>
                <label class="flex justify-center content-center items-center q-ml-sm otp-label">{{ t3 }}</label>
                <label class="flex justify-center content-center items-center q-ml-sm otp-label">{{ t4 }}</label>
                <q-input class="full-width otp-input" pattern="\d*" maxlength="4" autofocus type="tel" v-model="pin" dark borderless />
            </div>
        </div>

        <div class="flex row justify-center items-end full-width">
            <h3 v-if="errorMessage.length > 0" class="full-width">{{ errorMessage }}</h3>
            <q-btn class="full-width submit-button text-white" label="Подтвердить" :loading="submitting" :disable="!isButtonActive" @click="save">
                <template v-slot:loading>
                    <q-spinner />
                </template>
            </q-btn>
        </div>
    </q-page>
</template>

<script>
    import { buildFillRequest } from '../boot/options';

    export default {
        name: "SignUpSecondStep",

        data() {
            return {
                pin: '',
                passwordRepeat: '',
                check: false,
                submitting: false,
                isButtonActive: true,
                errorMessage: '',
                idrref: this.$config.userIdrref,
                // deviceId: device.uuid,
                deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1',
                signature: 'a80ef6f574652d870113226ba0cbe72c'
            }
        },

        computed: {
            t1: function () {
                if (this.pin.length >= 1) {
                    return this.pin.charAt(0)
                } else {
                    return ''
                }
            },
            t2: function () {
                if (this.pin.length >= 2) {
                    return this.pin.charAt(1)
                } else {
                    return ''
                }
            },
            t3: function () {
                if (this.pin.length >= 3) {
                    return this.pin.charAt(2)
                } else {
                    return ''
                }
            },
            t4: function () {
                if (this.pin.length == 4) {
                    return this.pin.charAt(3)
                } else {
                    return ''
                }
            }
        },

        methods: {
            getStatus: async function () {
                this.errorMessage = '';
                this.check = true;

                let query = `select * from _reference13 where _cid = '${this.deviceId}'`;
                let envelope = buildFillRequest(query);

                let options = {
                    method: 'post',
                    url: 'http://pn.pronet.kg:1072',
                    data: envelope
                };

                let data = await this.$axios(options)
                    .then(response => {
                        let res = response.data.envelope.body.response.data[0]["_status"];

                        if (res == 0) this.errorMessage = 'В ожидании';
                        if (res == 2) this.errorMessage = 'Отклонено';
                        if (res == 1) this.errorMessage = 'Принято';

                        this.check = false;
                        localStorage.status = res;

                        return this.errorMessage;
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при запросе статуса терминала: ', JSON.stringify(err));

                        this.errorMessage = 'Произошла ошибка при соединении с сервером'
                        this.check = false;
                    })

                return data
            },

            save: async function () {
                console.log('Запушен второй шаг регистрации');

                this.submitting = true;
                this.isButtonActive = false;

                if (this.pin.length == 0 || this.pin.length < 4) {
                    console.warn('Не заполено поле с кодом смс');

                    this.errorMessage = 'Введите код с смс';
                    this.submitting = false;
                    this.isButtonActive = true;
                    return
                }

                let options = {
                    method: 'post',
                    url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=2&idrref=${this.idrref}&pin=${this.pin}&signature=${this.signature}`,
                };

                this.$axios(options)
                    .then(response => {
                        console.log('Второй шаг регистрации прошел успешно', response);

                        let data = response.data.envelope.body.response.data;

                        if (data.length == 0) {
                            this.errorMessage = 'Неверный пин код. Попробуйте снова'
                            this.submitting = false;
                            this.isButtonActive = true;
                            return;
                        }

                        let code = response.data.envelope.body.response.data._code;
                        this.$store.commit('setAccount', code)
                        this.submitting = false;
                        this.isButtonActive = true;

                        localStorage.idrref = this.$config.userIdrref;
                        localStorage.account = code;

                        this.$router.replace('third-step')
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при втором шаге регистрации: ', JSON.stringify(err));

                        this.errorMessage = 'Произошла ошибка при соединении с сервером'
                        this.submitting = false;
                        this.isButtonActive = true;
                    })
            }
        }
    }
</script>

<style scoped>

</style>
