<template>
    <q-header reveal class="bg-primary-dark1 no-shadow">
        <q-toolbar class="q-pt-xl">
            <q-btn v-if="routesWithBackButton.includes(currentRoute)" flat round dense class="q-mr-sm" @click="$router.replace('first-step')">
                <img class="back-button-icon" src="../assets/back.png">
            </q-btn>

            <q-toolbar-title class="flex justify-center">
                <h1 v-if="currentRoute == '/signup/third-step'">Авторизация</h1>
                <h1 v-else>Регистрация</h1>
            </q-toolbar-title>
            
            <q-btn v-if="routesWithBackButton.includes(currentRoute)" flat round dense class="q-mr-sm" />
        </q-toolbar>
    </q-header>
</template>

<script>
export default {
    name: 'Header',

    data() {
        return {
            currentRoute: this.$router.currentRoute.path,
            routesWithBackButton: ['/signup/second-step']
        }
    }
}
</script>

<style scoped>

</style>