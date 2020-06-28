<template>
    <q-page class="flex justify-center content-center">
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
