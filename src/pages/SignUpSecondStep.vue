<template>
    <q-page class="flex q-pa-lg">
        <div class="flex row justify-center items-start full-width">
            <h1 class="q-mt-lg">Регистрация</h1>
        </div>
        <div class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width">Создайте пароль</h2>
            <q-input class="full-width input" dark borderless placeholder="Введите пароль" />
            <q-input class="q-mt-md full-width input" dark borderless placeholder="Повторите пароль" />
        </div>
        <div class="flex row justify-center content-end items-end full-width">
            <q-btn class="q-mb-lg reload-button" size="lg" round color="red" no-caps>
                <img src="../assets/reload.png" alt="" style="width: 28px">
            </q-btn>
            <h3 class="full-width">Введенные пароли не совпадают введите еще раз</h3>
        </div>
        <div class="flex row justify-center items-end full-width">
            <q-btn class="q-mb-lg full-width submit-button" label="Завершить" @click="$router.replace('third-step')" no-caps />
        </div>
    </q-page>
</template>

<script>
    export default {
        name: "SignUpSecondStep"
    }
</script>

<style scoped>

</style>
