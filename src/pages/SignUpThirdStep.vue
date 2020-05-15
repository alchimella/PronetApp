<template>
    <q-page class="flex q-pa-lg">
        <Header />

        <div class="flex row justify-center content-center full-width">
            <img src="../assets/avatar.png" alt="" style="width: 87px; height: 110px">
            <h2 class="flex justify-center full-width">Ваш лицевой счет</h2>
            <h1>100258752</h1>
            <h2 class="flex justify-center full-width">Введите пароль</h2>
            <q-input class="full-width input" v-model="password" dark borderless :type="isPwd ? 'password' : 'text'" placeholder="Введите пароль">
                <template v-slot:append>
                <q-icon
                    class="q-pr-lg"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
        </div>

        <div class="flex row justify-center content-end items-end full-width">
            <q-btn class="q-mt-lg q-mb-lg call-button" size="lg" color="success-green2" round>
                <a class="flex items-center" href="tel:+996550426964">
                    <img class="button-icon" src="../assets/call.png">
                </a>
            </q-btn>
            <h3 class="flex justify-center full-width">Служба поддержки</h3>
        </div>
        
        <div class="flex row justify-center items-end full-width">
            <h3 v-show="errorMessage.length > 0" class="q-pa-lg full-width">{{ errorMessage }}</h3>
            <q-btn class="full-width submit-button" label="Авторизация" :loading="submitting" :disable="!isButtonActive" @click="singIn" no-caps />
        </div>
    </q-page>
</template>

<script>
    import Header from '../components/Header'
    import { buildFillRequest } from '../boot/options';

    export default {
        name: "SignUpThirdStep",
        components: { Header },

        data() {
            return {
                password: '',
                errorMessage: '',
                submitting: false,
                isButtonActive: true,
                deviceId: device.uuid,
                // deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1',
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
                    url: 'http://web.pronet.kg:1082',
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

                if (this.password.length == 0) {
                    console.warn('Поле с паролем не заполнено');

                    this.errorMessage = 'Заполните поле';
                    this.submitting = false;
                    this.isButtonActive = true;
                    return
                }

                if (this.password != localStorage.password) {
                    console.warn('Неверный пароль');

                    this.errorMessage = 'Неверный пароль. Введите еще раз';
                    this.submitting = false;
                    this.isButtonActive = true;
                    return
                }

                let status = await this.getStatus;

                if (localStorage.status == 0) {
                    this.submitting = false;
                    this.isButtonActive = true;

                    return this.errorMessage = 'В ожидании';
                }
                if (localStorage.status == 2) {
                    this.submitting = false;
                    this.isButtonActive = true;

                    return this.errorMessage = 'Отклонено';
                }

                this.errorMessage = '';
                this.submitting = false;
                this.isButtonActive = true;
                this.$router.replace('/')
            }
        }
    }
</script>

<style scoped>

</style>
