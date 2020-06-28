<template>
    <q-page class="flex q-pa-lg">
        <div class="flex row justify-center content-center full-width">
            <img class="l-logo" src="../assets/logo.png" />
        </div>

        <div class="flex row justify-center content-center full-width">
            <h1 class="flex justify-center full-width">Ваш лицевой счет</h1>
            <h2>{{ account }}</h2>
            <h1 class="flex justify-center full-width">Введите пароль</h1>
            <q-input class="full-width input" v-model="password" borderless :type="isPwd ? 'password' : 'text'" placeholder="Введите пароль">
                <template v-slot:append>
                <q-icon
                    class="q-pr-lg"
                    :name="!isPwd ? 'visibility_off' : 'visibility'"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
        </div>

        <div class="flex row justify-center items-end full-width">
            <h3 v-show="errorMessage.length > 0" class="q-pa-lg full-width">{{ errorMessage }}</h3>
            <q-btn class="full-width submit-button text-white" label="Авторизация" :loading="submitting" :disable="!isButtonActive" @click="singIn" />
        </div>
    </q-page>
</template>

<script>
    import { buildFillRequest } from '../boot/options';

    export default {
        name: "SignUpThirdStep",

        data() {
            return {
                password: '',
                errorMessage: '',
                idrref: localStorage.idrref,
                account: localStorage.account,
                submitting: false,
                isButtonActive: true,
                // deviceId: device.uuid,
                deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1',
                signature: 'a80ef6f574652d870113226ba0cbe72c',
                isPwd: true
            }
        },

        computed: {
            getStatus: async function () {
                this.errorMessage = '';

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

                        localStorage.status = res;
                        return this.errorMessage;
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при запросе статуса терминала: ', JSON.stringify(err));
                        this.errorMessage = 'Произошла ошибка при соединении с сервером'
                    })

                return data
            }
        },

        methods: {
            singIn: async function () {
                this.submitting = true;
                this.isButtonActive = false;

                let message = '';

                if (this.password.length == 0) {
                    console.warn('Поле с паролем не заполнено');

                    this.errorMessage = 'Заполните поле';
                    this.submitting = false;
                    this.isButtonActive = true;
                    return
                }

                let options = {
                    method: 'post',
                    url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=3&idrref=${this.idrref}&passwd=${this.password}&signature=${this.signature}`,
                };

                this.$axios(options)
                    .then(response => {
                        console.log('Авторизация прошела успешно', response);

                        let hasError = response.data.envelope.body.response.haserror;
                        message = response.data.envelope.body.response.message;

                        if (hasError) throw new Error('Неверный пароль. Введите еще раз')

                        let code = response.data.envelope.body.response.data._code;
                        this.$store.commit('setAccount', code)
                        this.errorMessage = '';
                        this.submitting = false;
                        this.isButtonActive = true;

                        this.$router.replace('/')
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при авторизации: ', err);

                        this.errorMessage = message;
                        this.submitting = false;
                        this.isButtonActive = true;
                    })
            }
        }
    }
</script>

<style scoped>

</style>
