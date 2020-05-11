<template>
    <q-page class="flex flex-center q-pa-lg">
        <div class="flex row justify-center">
            <img class="col-10" src="../assets/card-background.png" alt="">
        </div>
        <div class="flex row justify-end q-pa-lg full-width" style="position: absolute; bottom: 0">
            <FloatActionButton />
        </div>
    </q-page>
</template>

<script>
import FloatActionButton from '../components/FloatActionButton'

export default {
    name: 'Cards',
    components: { FloatActionButton },

    data() {
        return {
            
        }
    }
}
</script>

<style scoped>

</style>