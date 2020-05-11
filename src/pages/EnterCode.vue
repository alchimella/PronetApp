<template>
    <q-page class="flex flex-center content-center q-pa-lg">
        <h2 class="flex justify-center full-width">Введите код талона</h2>
        <q-input class="full-width input" v-model="code" dark borderless />
        <div class="flex row justify-center items-end full-width">
            <q-btn class="q-mt-lg q-mb-lg full-width submit-button" label="Далее" no-caps />
        </div>
        <div class="flex row justify-end q-pa-lg full-width" style="position: absolute; bottom: 0">
            <FloatActionButton />
        </div>
    </q-page>
</template>

<script>
import FloatActionButton from '../components/FloatActionButton'

export default {
    name: 'EnterCode',
    components: { FloatActionButton },

    data() {
        return {
            code: ''
        }
    }
}
</script>

<style scoped>

</style>