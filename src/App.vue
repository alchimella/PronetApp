<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { buildFillRequest } from './boot/options';

export default {
  name: 'App',

  data() {
    return {
      // status: localStorage.status,
      idrref: localStorage.idrref,
      account: localStorage.account,
      // deviceId: device.uuid,
      deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1'
    }
  },

  mounted() {
    let path = 'signup/first-step';

    if (this.idrref || this.account) path = 'signup/third-step';
    if (!localStorage.appVersion) {
        // this.$config.userCurrentAppVersion = AppVersion.version
        // localStorage.appVersion = AppVersion.version
        this.$config.userCurrentAppVersion = 1;
        localStorage.appVersion =1
    } else {
        this.$config.userCurrentAppVersion = localStorage.appVersion
    }

    this.$router.replace({'path': path})
  }
}
</script>
