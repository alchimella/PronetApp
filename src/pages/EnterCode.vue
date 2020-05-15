<template>
    <q-page class="flex flex-center content-center q-pa-lg">
        <h2 class="flex justify-center full-width">Введите код талона</h2>
        <q-input class="full-width input" v-model="code" dark borderless />
        
        <div class="flex row justify-center items-end full-width">
            <h3 v-show="errorMessage.length > 0" class="q-pt-lg full-width">{{ errorMessage }}</h3>
            <q-btn class="q-mt-lg q-mb-lg full-width submit-button" label="Далее" :loading="submitting" :disable="!isButtonActive" @click="enter" no-caps>
                <template v-slot:loading>
                    <q-spinner />
                </template>
            </q-btn>
        </div>

        <div class="flex row justify-end q-pa-lg full-width" style="position: absolute; bottom: 0">
            <FloatActionButton />
        </div>
    </q-page>
</template>

<script>
import FloatActionButton from '../components/FloatActionButton'
import { getCardRequest } from '../boot/options';

export default {
    name: 'EnterCode',
    components: { FloatActionButton },

    data() {
        return {
            code: '',
            errorMessage: '',
            submitting: false,
            isButtonActive: true
        }
    },

    methods: {
        enter: async function () {
            console.log('Запушен процесс отправки запроса по талону в ручную');

            if (this.code.length == 0) {
                this.errorMessage = 'Заполните поле'
                return
            }

            this.errorMessage = '';
            this.submitting = true;
            this.isButtonActive = false;

            let envelope = getCardRequest(this.code);

            if (this.code) {
                let options = {
                    method: 'post',
                    url: 'http://web.pronet.kg:1082',
                    data: envelope
                };

                this.$axios(options)
                    .then(response => {
                        let data = response.data.envelope.body.response.data;

                        if (data.length) {
                            console.log('Найден талон с номером - ' + this.code, data);

                            this.errorMessage = ''    
                            this.submitting = false;
                            this.isButtonActive = true;

                            alert('Найден талон с номером - ' + this.code)

                        } else {
                            console.log('Талонов с кодом - ' + this.code + ' не найдено!');

                            this.errorMessage = 'Совпадений не найдено!'
                            this.submitting = false;
                            this.isButtonActive = true;
                        }
                    })
                    .catch(err => {
                        console.log('Произошла ошибка при поиске талона: ', err);

                        this.errorMessage = 'Произошла ошибка при поиске талона!'
                        this.submitting = false;
                        this.isButtonActive = true;
                    })
            }
        }
    }
}
</script>

<style scoped>

</style>