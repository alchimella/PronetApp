<template>
    <q-page class="flex q-pa-lg">
        <div class="flex row justify-center items-start full-width">
            <h1 class="q-mt-lg">Регистрация</h1>
        </div>
        <div class="flex row items-start full-width">
            <q-btn class="q-mb-lg" size="lg" round color="next-blue1" @click="$router.replace('first-step')">
                <img class="button-icon" src="../assets/back.png">
            </q-btn>
        </div>
        <div class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width">Создайте пароль</h2>
            <q-input class="full-width input" v-model="password" dark borderless type="password" placeholder="Введите пароль" />
            <q-input class="q-mt-md full-width input" v-model="password1" dark borderless type="password" placeholder="Повторите пароль" />
        </div>
        <div class="flex row justify-center content-end items-end full-width">
            <q-btn class="q-mb-lg" size="lg" round color="warning-orange1" no-caps>
                <img class="button-icon" src="../assets/reload.png">
            </q-btn>
            <h3 class="q-pl-lg q-pr-lg full-width">Введенные пароли не совпадают введите еще раз</h3>
        </div>
        <div class="flex row justify-center items-end full-width">
            <q-btn class="q-mb-lg full-width submit-button" label="Завершить" @click="$router.replace('third-step')" no-caps />
        </div>
    </q-page>
</template>

<script>
    export default {
        name: "SignUpSecondStep",

        data() {
            return {
                password: '',
                password1: ''
                // isPwd: true
            }
        }
    }
</script>

<style scoped>

</style>
