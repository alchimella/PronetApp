<template>
    <q-page class="flex q-pa-lg">
        <Header />

        <div class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width">Введите номер</h2>
            <q-input class="full-width input" v-model="phone" type="tel" pattern="\d*" dark borderless mask="+### (###) ### ###" placeholder="+996 (000) 000  000 " />
        </div>

        <div class="flex row justify-center content-end items-end full-width">
            <h3 v-show="errorMessage.length > 0" class="q-pl-lg q-pr-lg q-pb-lg full-width">{{ errorMessage }}</h3>
            <q-btn class="full-width submit-button" label="Далее" :loading="submitting" :disable="!isButtonActive" @click="registerTerminal" no-caps>
                <template v-slot:loading>
                    <q-spinner />
                </template>
            </q-btn>
        </div>
    </q-page>
</template>

<script>
    import Header from '../components/Header'
    import { buildRegTRequest } from '../boot/options';

    export default {
        name: "SignUpFirstStep",
        components: { Header },
        
        data() {
            return {
                phone: '',
                errorMessage: '',
                submitting: false,
                isButtonActive: true,
                deviceId: device.uuid,
                // deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1'
            }
        },

        methods: {
            registerTerminal: function () {
                console.log('Запушен процесс регистрации терминала');

                if (this.phone.length == 0) {
                    console.warn('Не заполено поле с номером телефона');

                    this.errorMessage = 'Заполните поле с номером телефона';
                    return
                }

                this.errorMessage = '';
                this.submitting = true;
                this.isButtonActive = false;

                let params = { deviceId: this.deviceId, comment: this.phone };
                let envelope = buildRegTRequest(params);

                let options = {
                    method: 'post',
                    url: 'http://web.pronet.kg:1082',
                    data: envelope
                };

                this.$axios(options)
                    .then(response => {
                        console.log('Запрос на регистрацию терминала прошел успешно. Ожидается подтверждение!', response);

                        this.submitting = false;
                        this.isButtonActive = true;
                        this.$router.replace('second-step')
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при регистрации терминала: ', JSON.stringify(err));

                        this.errorMessage = '';
                        this.submitting = false;
                        this.isButtonActive = true;
                    });
            }
        }
    }
</script>

<style scoped>

</style>
