<template>
    <q-page class="flex justify-center content-center">
        <img src="../assets/avatar.png" style="width: 87px; height: 110px">
        <h2 class="flex justify-center full-width">Ваш лицевой счет</h2>
        <h1>{{ account }}</h1>
    </q-page>
</template>

<script>
    export default {
        name: 'PageIndex',

        data() {
            return {
                account: this.$store.getters.account
            }
        }
    }
</script>
