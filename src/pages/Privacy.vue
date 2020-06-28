<template>
    <q-page class="flex q-pa-lg ">
        <div class="flex row justify-center content-center full-width">
            <h1 class="" style="height: 25%">{{main_title}}</h1>
            <q-list>
                <q-item tag="label" v-ripple>
                    <q-item-section avatar top>
                        <q-checkbox v-model="first_checkbox" color="cyan" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="confid-text">{{first_checkbox_title}}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-item tag="label">
                    <q-item-section avatar top>
                        <q-checkbox v-model="second_checkbox" color="cyan" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label class="confid-text">{{second_checkbox_title}}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
        <div class="flex row justify-center content-end items-end full-width">
            <h3 v-show="errorMessage.length > 0" class="q-pl-lg q-pr-lg q-pb-lg full-width">{{ errorMessage }}</h3>
            <q-btn class="full-width submit-button text-white" label="Согласен"  :disable="!isButtonActive" @click="consentToPrivacy()">
                <template v-slot:loading>
                    <q-spinner />
                </template>
            </q-btn>
        </div>
    </q-page>
</template>

<script>
    export default {
        name: "Privacy",
        data () {
            return {
                main_title:'Соглашение  о конфиденциальности',
                first_checkbox: false,
                first_checkbox_title: 'Я согласен на обработку моих персональных данных для возможности оказания мне услуг, информирования меня о специальных предложениях и иных товарах',
                second_checkbox: false,
                second_checkbox_title: 'Список соглашений на услуги отдельно если необходимо',
                isButtonActive: false,
                errorMessage: ''
            }
        },
        watch: {
            first_checkbox: function (newVal) {
                if (newVal && this.second_checkbox) this.isButtonActive = true
            },
            second_checkbox: function (newVal) {
                if (newVal && this.first_checkbox) this.isButtonActive = true
            }
        },
        methods: {
            consentToPrivacy(){
                this.$router.replace('first-step')
            }
        }
    }
</script>

<style scoped>

</style>
