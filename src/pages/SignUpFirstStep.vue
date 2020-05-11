<template>
    <q-page class="flex q-pa-lg">
        <div class="flex row justify-center items-start full-width">
            <h1 class="q-mt-lg">Регистрация</h1>
        </div>
        <div class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width">Введите номер</h2>
            <q-input class="full-width input" v-model="phone" dark borderless placeholder="+966 (000) 000  000 " />
        </div>
        <div class="flex row justify-center items-end full-width">
            <q-btn class="q-mb-lg full-width submit-button" label="Далее" @click="$router.replace('second-step')" no-caps />
        </div>
    </q-page>
</template>

<script>
    export default {
        name: "SignUpFirstStep",
        data() {
            return {
                phone: '',
                // deviceId: device.uuid,
                deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfc6d4'
            }
        },

        methods: {
            terminalRegistration: function () {
                console.log('Запушен процесс регистрации терминала');

                let params = { deviceId: this.deviceId };
                let envelope = buildRegTRequest(params);

                let options = {
                    method: 'post',
                    url: 'http://web.pronet.kg:1082',
                    data: envelope
                };

                let _this = this;

                this.$axios(options)
                    .then(response => {
                        console.log('Запрос на регистрацию терминала прошел успешно. Ожидается подтверждение!', response);
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при регистрации терминала: ', err);
                    });
            }
        }
    }
</script>

<style scoped>

</style>
