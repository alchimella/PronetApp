<template>
    <q-page class="flex flex-center">
        <img v-if="isUser" alt="" src="../statics/test.png" style="width: 30vh">
    </q-page>
</template>

<script>
export default {
    name: 'PageIndex',
    props: ['isUser']
}
</script>
