<template>
    <q-layout view="lHh Lpr lFf">
        <q-page-container class="background">
            <router-view />
            <Footer />
        </q-page-container>
    </q-layout>
</template>

<script>
    import Footer from '../components/Footer'

    export default {
        name: 'MyLayout',
        components: { Footer },

        data () {
            return {

            }
        }
    }
</script>

<style scoped>

</style>
