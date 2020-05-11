<template>
  <q-layout>
    <q-page-container class="background-signup">
        <transition
            appear
            enter-active-class="animated slideInLeft"
            leave-active-class="animated slideInRight"
            >
            <router-view />
        </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
    name: 'SignUp',
}
</script>