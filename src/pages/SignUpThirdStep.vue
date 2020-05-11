<template>
    <q-page class="flex q-pa-lg">
        <div class="flex row justify-center items-start full-width">
            <h1 class="q-mt-lg">Регистрация</h1>
        </div>
        <div class="flex row justify-center content-center full-width">
            <img src="../assets/avatar.png" alt="" style="width: 87px">
            <h2 class="flex justify-center full-width">Ваш лицевой счет</h2>
            <h1>100258752</h1>
            <h2 class="flex justify-center full-width">Введите пароль</h2>
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
        <div class="flex row justify-center content-end items-end full-width">
            <q-btn class="q-mb-lg call-button" size="lg" color="success-green2" round>
                <a class="flex items-center" href="tel:+996550426964">
                    <img class="button-icon" src="../assets/call.png">
                </a>
            </q-btn>
            <h3 class="flex justify-center full-width">Служба поддержки</h3>
        </div>
        <div class="flex row justify-center items-end full-width">
            <q-btn class="q-mb-lg full-width submit-button" label="Авторизация" no-caps />
        </div>
    </q-page>
</template>

<script>
    export default {
        name: "SignUpThirdStep",

        data() {
            return {
                password: '',
                isPwd: true
            }
        }
    }
</script>

<style scoped>

</style>
