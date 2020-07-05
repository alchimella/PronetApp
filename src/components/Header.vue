<template>
    <q-header reveal class="bg-primary-dark1 no-shadow">
        <q-toolbar class="q-pt-xl">
            <q-btn v-if="routesWithBackButton.includes(currentRoute)" flat round dense class="q-mr-sm" @click="goBack">
                <img class="back-button-icon" src="../assets/back.png">
            </q-btn>

            <q-toolbar-title class="flex justify-center">
                <h1 v-if="currentRoute == '/signup/fourth-step'">Авторизация</h1>
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
            routesWithBackButton: ['/signup/second-step', '/signup/third-step']
        }
    },

    methods: {
        goBack: function () {
            if (this.$router.currentRoute.path == '/signup/second-step') this.$router.replace('first-step')
            if (this.$router.currentRoute.path == '/signup/third-step') this.$router.replace('first-step')
        }
    }
}
</script>

<style scoped>

</style>
