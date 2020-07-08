<template>
    <q-fab class="float-action-button" hide-icon color="next-blue1" size="lg" direction="left">
        <q-fab-action icon="" color="next-blue1" @click="$router.replace('enter-code')">
            <img style="width: 32px; height: 22px" src="../assets/enter-code.png" alt="">
        </q-fab-action>

        <q-fab-action icon="" color="next-blue1" @click="scan">
            <img style="width: 32px; height: 22px" src="../assets/scan.png" alt="">
        </q-fab-action>
    </q-fab>
</template>

<script>
export default {
    name: 'FloatActionButton',
    props: ['isScaned'],

    data() {
        return {
            signature: this.$config.signature
        }
    },

    methods: {
        scan: function () {
            let _this = this;

            cordova.plugins.barcodeScanner.scan(
                async function (result) {
                    let code = result.text;

                    _this.isScaned = true;
                    _this.$emit('spinner', _this.isScaned)

                    if (result.cancelled) {
                        _this.isScaned = false;
                        _this.$emit('spinner', _this.isScaned)
                    }

                    if (code) {
                        let options = {
                            method: 'post',
                            url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=4&idrref=${result.text}&signature=${_this.signature}`
                        };

                        await _this.getCoupons(options, code)
                        _this.isScaned = false;
                        _this.$emit('spinner', _this.isScaned)
                        _this.$router.replace('coupons');
                    }
                },
                function (error) {
                    // alert('Scanning failed: ' + error)
                    alert(error)
                    _this.isScaned = false;
                    _this.$emit('spinner', _this.isScaned)
                },
                {
                    preferFrontCamera: false, // iOS and Android
                    showFlipCameraButton: true, // iOS and Android
                    showTorchButton: true, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    saveHistory: true, // Android, save scan history (default false)
                    prompt: '', // Android
                    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats: 'QR_CODE,EAN_8,EAN_13,CODE_128', // default: all but PDF_417 and RSS_EXPANDED
                    orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations: true, // iOS
                    disableSuccessBeep: false // iOS and Android
                }
            )
        },

        getCoupons: async function (options, code) {
            try {
                let response = await this.$axios(options);
                let data = response.data.data;

                if (data.length) {
                    console.log('Найден талон с номером - ' + code, data);
                    let result = data.filter(item => item._accumreg1_amount > 0);
                    this.$store.dispatch('loadCoupons', result);
                } else {
                    console.log('Нет данных', data);
                    alert('Талонов с кодом - ' + code + ' не найдено!')
                }
            } catch (e) {
                console.log('Произошла ошибка при поиске талона: ', err);
            }
        }
    }
}
</script>

<style scoped>
.q-btn-item {
    height: 56px;
    width: 56px;
}
</style>
