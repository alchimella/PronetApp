<template>
    <q-fab class="float-action-button" hide-icon icon="" color="next-blue1" size="lg" direction="left">
        <q-fab-action color="next-blue1" @click="$router.replace('enter-code')">
            <img style="width: 32px; height: 22px" src="../assets/enter-code.png" alt="">
        </q-fab-action>
        
        <q-fab-action color="next-blue1" @click="scan">
            <img style="width: 32px; height: 22px" src="../assets/scan.png" alt="">
        </q-fab-action>
    </q-fab>
</template>

<script>
export default {
    name: 'FloatActionButton',

    methods: {
        scan: function () {
            let _this = this;
            alert('text')

            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    alert(result.text)
                    if (result.text) {
                        let options = {
                            method: 'post',
                            url: 'http://web.pronet.kg:1082',
                            data: envelope
                        };

                        this.$axios(options)
                            .then(response => {
                                let data = response.data.envelope.body.response.data;

                                if (data.length) {
                                    console.log('Найден талон с номером - ' + result.text, data);

                                    alert('Найден талон с номером - ' + result.text)

                                } else {
                                    console.log('Талонов с кодом - ' + result.text + ' не найдено!');
                                    alert('Талонов с кодом - ' + result.text + ' не найдено!')
                                }
                            })
                            .catch(err => {
                                console.log('Произошла ошибка при поиске талона: ', err);
                                alert('Произошла ошибка при поиске талона')
                            })
                    }
                },
                function (error) {
                    // alert('Scanning failed: ' + error)
                },
                {
                    preferFrontCamera: false, // iOS and Android
                    showFlipCameraButton: true, // iOS and Android
                    showTorchButton: true, // iOS and Android
                    torchOn: false, // Android, launch with the torch switched on (if available)
                    saveHistory: true, // Android, save scan history (default false)
                    prompt: 'Place a barcode inside the scan area', // Android
                    resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                    formats: 'QR_CODE,EAN_8,EAN_13,CODE_128', // default: all but PDF_417 and RSS_EXPANDED
                    orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
                    disableAnimations: true, // iOS
                    disableSuccessBeep: false // iOS and Android
                }
            )
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