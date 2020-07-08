<template>
    <q-page class="flex q-pa-lg">
        <Header />

        <div class="flex row justify-center content-center full-width">
            <q-input class="q-mt-md full-width input" v-model="password" dark borderless type="password" placeholder="Введите пароль" />
            <q-input v-if="!isUserExist" class="q-mt-md full-width input" v-model="repeatPassword" dark borderless type="password" placeholder="Повторите пароль" />
        </div>

        <div class="flex row justify-center content-end items-end full-width">
            <h3 v-show="errorMessage.length > 0" class="q-pl-lg q-pr-lg q-pb-lg full-width">{{ errorMessage }}</h3>
            <q-btn v-if="!isUserExist" class="full-width submit-button" label="Далее" :loading="submitting" :disable="!isButtonActive" @click="registerTerminal" no-caps>
                <template v-slot:loading>
                    <q-spinner />
                </template>
            </q-btn>

            <q-btn v-else class="full-width submit-button" label="Далее" :loading="submitting" :disable="!isButtonActive" @click="reRegistration" no-caps>
                <template v-slot:loading>
                    <q-spinner />
                </template>
            </q-btn>
        </div>
    </q-page>
</template>

<script>
    import Header from '../components/Header'

    export default {
        name: "SignUpSecondStep",
        components: { Header },

        data() {
            return {
                password: '',
                repeatPassword: '',
                isPwd: true,
                errorMessage: this.$store.getters.errorMessage,
                submitting: false,
                isButtonActive: true,
            }
        },

        computed: {
            isUserExist: function() {
                return this.$store.getters.isUserExist
            }
        },

        methods: {
            registerTerminal: function () {
                console.log('Запушен первый регистрации');

                if (this.password.length == 0) {
                    console.warn('Не заполены поля');

                    this.errorMessage = 'Заполните поля';
                    return
                }

                if (this.password != this.repeatPassword && !this.isUserExist) {
                    console.warn('Не совпадают пароли');

                    this.errorMessage = 'Не совпадают поля паролей';
                    return
                }

                this.errorMessage = '';
                this.submitting = true;
                this.isButtonActive = false;

                let phone = this.$store.getters.phone
                let idrref = this.$config.userIdrref

                let options = {
                    method: 'post',
                    url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=10&idrref=${idrref}&phone=${phone}&passwd=${this.password}`
                };

                this.$axios(options)
                    .then(response => {
                        console.log('Первый шаг регистрацию терминала прошел успешно. Ожидается подтверждение!', response);

                        let data = response.data.data
                        let idrref = response.data.data[0]._idrref;
                        if (data.length != 0) {
                            this.$config.userIdrref = idrref;
                            this.submitting = false;
                            this.isButtonActive = true;
                            this.$store.commit('setPhone', this.phone);
                            this.$store.commit('setErrorMessage', '');
                            this.$router.replace('third-step')
                        }
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при первом регистрации терминала: ', err);

                        this.errorMessage = 'Произошла ошибка при соединении с сервером';
                        this.submitting = false;
                        this.isButtonActive = true;
                    });
            },
            reRegistration: function () {
                this.submitting = true;
                this.isButtonActive = false;

                let phone = this.$store.getters.phone

                let options = {
                    method: 'post',
                    url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=9&passwd=${this.password}&phone=${phone}`
                };

                this.$axios(options)
                    .then(response => {
                        console.log('Первый шаг перерегистрации пользователя прошел успешно. Ожидается подтверждение!', response);
                        let idrref = response.data.data[0]._idrref;
                        let message = response.data.message;
                        if (idrref) {
                            this.$config.userIdrref = idrref;
                            this.submitting = false;
                            this.isButtonActive = true;
                            this.$router.replace('third-step')
                        } else {
                            this.submitting = false;
                            this.isButtonActive = true;
                            this.errorMessage = message
                            return
                        }
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при первом регистрации терминала: ', err);
                        this.errorMessage = 'Произошла ошибка при соединении с сервером';
                        this.submitting = false;
                        this.isButtonActive = true;
                    });
            }
        },

        beforeDestroy() {
            this.$store.commit('setErrorMessage', '');
            this.$store.commit('setUserExist', false);
        }
    }
</script>

<style scoped>

</style>
