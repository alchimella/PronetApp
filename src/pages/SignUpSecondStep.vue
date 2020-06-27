<template>
    <q-page class="flex q-pa-lg">
        <Header />
        <div class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width q-mt-xl">Введите код</h2>

            <label class="flex justify-center content-center items-center q-ml-sm pin-label">{{ t1 }}</label>
            <label class="flex justify-center content-center items-center q-ml-sm pin-label">{{ t2 }}</label>
            <label class="flex justify-center content-center items-center q-ml-sm pin-label">{{ t3 }}</label>
            <label class="flex justify-center content-center items-center q-ml-sm pin-label">{{ t4 }}</label>
            <q-input class="q-mt-md full-width pin-input" pattern="\d*" maxlength="4" autofocus type="tel" v-model="pin" dark borderless />
            <!-- <q-input class="full-width input" v-model="password" dark borderless type="password" placeholder="Введите пароль" />
            <q-input class="q-mt-md full-width input" v-model="passwordRepeat" dark borderless type="password" placeholder="Повторите пароль" /> -->
        </div>

        <!-- <div class="flex row justify-center content-end items-end full-width">
            <q-btn class="q-mb-lg" size="lg" round color="warning-orange1" no-caps :loading="check" @click="getStatus">
                <img class="button-icon" src="../assets/reload.png">
            </q-btn>
            <h3 v-show="errorMessage.length > 0" class="q-pl-lg q-pr-lg full-width">{{ errorMessage }}</h3>
        </div> -->

        <div class="flex row justify-center items-end full-width">
            <h3 v-show="errorMessage.length > 0" class="q-pa-lg full-width">{{ errorMessage }}</h3>
            <q-btn class="full-width submit-button" label="Завершить" :loading="submitting" :disable="!isButtonActive" @click="save" no-caps>
                <template v-slot:loading>
                    <q-spinner />
                </template>
            </q-btn>
        </div>
    </q-page>
</template>

<script>
    import Header from '../components/Header'
    import { buildFillRequest, buildLogonRequest } from '../boot/options';

    export default {
        name: "SignUpSecondStep",
        components: { Header },

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
                    return '•'
                } else {
                    return ''
                }
            },
            t2: function () {
                if (this.pin.length >= 2) {
                    return '•'
                } else {
                    return ''
                }
            },
            t3: function () {
                if (this.pin.length >= 3) {
                    return '•'
                } else {
                    return ''
                }
            },
            t4: function () {
                if (this.pin.length == 4) {
                    return '•'
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
