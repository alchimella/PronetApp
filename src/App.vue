<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      idrref: localStorage.idrref,
      account: localStorage.account,
      deviceId: device.uuid,
      // deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1'
    }
  },

  mounted() {
    let path = 'signup/first-step';

    if (this.idrref || this.account) path = 'signup/fourth-step';
    // if (!localStorage.appVersion) {
    //     this.$config.userCurrentAppVersion = AppVersion.version
    //     localStorage.appVersion = AppVersion.version
    // } else {
    //     this.$config.userCurrentAppVersion = localStorage.appVersion
    // }

    this.$router.replace({'path': path})
  }
}
</script>
