<template>
    <q-page class="flex q-pa-lg">
        <Header />
        <div class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width q-mt-xl">Создайте пароль</h2>
            <q-input class="full-width input" v-model="password" dark borderless type="password" placeholder="Введите пароль" />
            <q-input class="q-mt-md full-width input" v-model="passwordRepeat" dark borderless type="password" placeholder="Повторите пароль" />
        </div>

        <div class="flex row justify-center content-end items-end full-width">
            <q-btn class="q-mb-lg" size="lg" round color="warning-orange1" no-caps :loading="check" @click="getStatus">
                <img class="button-icon" src="../assets/reload.png">
            </q-btn>
            <h3 v-show="errorMessage.length > 0" class="q-pl-lg q-pr-lg full-width">{{ errorMessage }}</h3>
        </div>

        <div class="flex row justify-center items-end full-width">
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
                idrref: localStorage.idrref,
                password: '',
                passwordRepeat: '',
                check: false,
                submitting: false,
                isButtonActive: true,
                errorMessage: '',
                deviceId: device.uuid,
                // deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1'
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
                    url: 'http://web.pronet.kg:1082',
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

                if (this.password.length == 0 || this.passwordRepeat.length == 0) {
                    console.warn('Не заполено поля с паролями');

                    this.errorMessage = 'Заполните поля';
                    this.submitting = false;
                    this.isButtonActive = true;
                    return
                }

                if (this.password != this.passwordRepeat) {
                    console.warn('Введенные пароли не совпадают');
                    
                    this.errorMessage = 'Введенные пароли не совпадают введите еще раз';
                    this.submitting = false;
                    this.isButtonActive = true;
                    return
                }

                var status = await this.getStatus()

                this.errorMessage = status;
                this.submitting = false;
                this.isButtonActive = true;
                localStorage.password = this.password;
                
                this.$router.replace('third-step')
            }
        }
    }
</script>

<style scoped>

</style>
