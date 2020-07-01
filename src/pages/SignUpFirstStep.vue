<template>
    <q-page class="flex q-pa-lg">
        <Header />

        <div v-if="!isUserExist" class="flex row justify-center content-center full-width">

            <h2 class="flex justify-center full-width">Введите номер</h2>
            <q-select
                filled
                dark
                v-model="model"
                :options="options"
                color="bg-next-blue3"
                options-selected-class="text-deep-blue"
                class="q-mb-md full-width"
                style="font-size: 18px;"
            >
                <template v-slot:option="scope">
                    <q-item
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                    >
                        <q-item-section>
                            <q-item-label v-html="scope.opt.label" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label style="text-align: end" caption>{{ scope.opt.code }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>
            <div class="flex row justify-between full-width">
                <q-input class="col-3 input" v-model="code" type="tel" pattern="\d*" dark borderless unmasked-value />
                <q-input class="col-8 input" v-model="phone" type="tel" pattern="\d*" dark borderless unmasked-value placeholder="000 000 000 " />
            </div>
            <q-input class="q-mt-md full-width input" v-model="password" dark borderless :type="isPwd ? 'password' : 'text'" placeholder="Введите пароль">
                <template v-slot:append>
                <q-icon
                    class="q-pr-lg"
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
        </div>

        <div v-else class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width">Введите пароль</h2>

            <q-input class="q-mt-md full-width input" v-model="password" dark borderless :type="isPwd ? 'password' : 'text'" placeholder="Введите пароль">
                <template v-slot:append>
                    <q-icon
                        class="q-pr-lg"
                        :name="!isPwd ? 'visibility_off' : 'visibility'"
                        @click="isPwd = !isPwd"
                    />
                </template>
            </q-input>
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
        name: "SignUpFirstStep",
        components: { Header },

        data() {
            return {
                phone: '',
                password: '',
                errorMessage: '',
                submitting: false,
                isButtonActive: true,
                deviceId: device.uuid,
                // deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c2',
                signature: 'a80ef6f574652d870113226ba0cbe72c',
                isPwd: true,
                isUserExist: false,
                model: 'Кыргызстан',
                code: '+996',
                options: [
                    {
                        label: 'Кыргызстан',
                        value: 'Кыргызстан',
                        code: '+996'
                    }
                ]
            }
        },

        watch: {
            model: function (value) {
                if (value) this.code = this.model.code
            }
        },

        methods: {
            registerTerminal: function () {
                console.log('Запушен первый регистрации');

                if (this.code + this.phone.length == 0 || this.password.length == 0) {
                    console.warn('Не заполены поля');

                    this.errorMessage = 'Заполните поля';
                    return
                }

                this.errorMessage = '';
                this.submitting = true;
                this.isButtonActive = false;

                let options = {
                    method: 'post',
                    url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=1&phone=${this.code + this.phone}&passwd=${this.password}&signature=${this.signature}`
                };

                this.$axios(options)
                    .then(response => {
                        console.log('Первый шаг регистрацию терминала прошел успешно. Ожидается подтверждение!', response);

                        let data = response.data.envelope.body.response.data
                        let idrref = response.data.envelope.body.response.data._idrref;
                        if (data.length != 0) {
                            this.$config.userIdrref = idrref;
                            this.submitting = false;
                            this.isButtonActive = true;
                            this.$router.replace('second-step')
                        } else {
                            this.submitting = false;
                            this.isButtonActive = true;
                            this.errorMessage = `Данный номер телефона уже зарегистрирован`;
                            this.isUserExist = true;
                            this.password = ''
                        }
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при первом регистрации терминала: ', JSON.stringify(err));

                        this.errorMessage = 'Произошла ошибка при соединении с сервером';
                        this.submitting = false;
                        this.isButtonActive = true;
                    });
            },

            reRegistration: function () {
                this.submitting = true;
                this.isButtonActive = false;

                let options = {
                    method: 'post',
                    url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=9&passwd=${this.code + this.password}&phone=${this.phone}`
                };
                this.$axios(options)
                    .then(response => {
                        console.log('Первый шаг перерегистрации пользователя прошел успешно. Ожидается подтверждение!', response);
                        let idrref = response.data.envelope.body.response.data._idrref;
                        let message = response.data.envelope.body.response.message;
                        if (idrref) {
                            this.$config.userIdrref = idrref;
                            this.submitting = false;
                            this.isButtonActive = true;
                            this.isUserExist = false;
                            this.$router.replace('second-step')
                        } else {
                            this.submitting = false;
                            this.isButtonActive = true;
                            this.errorMessage = message
                            return
                        }
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при первом регистрации терминала: ', JSON.stringify(err));
                        this.errorMessage = 'Произошла ошибка при соединении с сервером';
                        this.submitting = false;
                        this.isButtonActive = true;
                    });
            }
        }
    }
</script>

<style scoped>

</style>
