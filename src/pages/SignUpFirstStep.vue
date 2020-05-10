<template>
    <q-page class="flex q-pa-lg">
        <div class="flex row justify-center items-start full-width">
            <h1 class="q-mt-lg">Регистрация</h1>
        </div>
        <div class="flex row justify-center content-center full-width">
            <h2 class="flex justify-center full-width">Введите номер</h2>
            <q-input class="full-width input" dark borderless placeholder="+966 (000) 000  000 " />
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
                
            }
        }
    }
</script>

<style scoped>

</style>
